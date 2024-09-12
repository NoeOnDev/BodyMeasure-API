import amqp from "amqplib";
import { saveHistory } from "./IoTService";
import { getPatientById } from "../patient/patientServices";
import { applyFormulas } from "./utils";

const startConsumer = async () => {
  try {
    const connection = await amqp.connect("amqp://user:password@98.82.41.126");
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
          ...results,
          resistance,
          reactance,
        });

        console.log(`Procesado: ${JSON.stringify(results)}`);

        channel.ack(msg);
      }
    });

    console.log("Esperando análisis...");
  } catch (error) {
    console.error("Error al iniciar consumer:", error);
  }
};

startConsumer();
