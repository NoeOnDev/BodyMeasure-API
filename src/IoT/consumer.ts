import amqp from "amqplib";
import { saveHistory } from "./IoTService";
import { getPatientById } from "../patient/patientServices";
import { applyFormulas } from "./utils";
import EventEmitter from "events";
import { env } from "../config/envConfig";

export const eventEmitter = new EventEmitter();

export const startConsumer = async () => {
  const connect = async () => {
    try {
      const connection = await amqp.connect(env.amqp.URL_AMQP);
      const channel = await connection.createChannel();

      await channel.assertQueue("response_queue", { durable: true });

      channel.consume("response_queue", async (msg) => {
        if (msg !== null) {
          const responseMessage = JSON.parse(msg.content.toString());
          const { patientId, resistance, reactance } = responseMessage;

          const patient = await getPatientById(patientId);
          const doctorId = patient.responsible_doctor;

          const results = applyFormulas(
            patient.height,
            patient.weight,
            patient.sex,
            resistance,
            reactance
          );

          await saveHistory(patientId, doctorId, {
            age: patient.age,
            height: patient.height,
            ...results,
            resistance,
            reactance,
          });

          console.log(`Procesado: ${JSON.stringify(results)}`);

          eventEmitter.emit("iotProcessed", { patientId });

          channel.ack(msg);
        }
      });

      console.log("Esperando análisis...");
    } catch (error) {
      console.error("Error al iniciar consumer:", error);
      setTimeout(connect, 5000);
    }
  };

  await connect();
};
