import mqtt from "mqtt";
import { Request, Response } from "express";
import { getPatientHistory, deleteHistoryById } from "./IoTService";
import { AuthRequest } from "../middleware/authenticateToken";
import { getPatientById } from "../patient/patientServices";
import { eventEmitter } from "./consumer";
import { env } from "../config/envConfig";

export const getPatientIoTData = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.user?.id;
    if (!patientId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const patient = await getPatientById(patientId);
    const doctorId = patient.responsible_doctor;

    const client = mqtt.connect(env.mqtt.URL_MQTT);

    client.on("connect", () => {
      const requestMessage = {
        patientId: patientId,
        doctorId: doctorId,
        requestType: "iot_analysis",
      };

      client.publish(
        "request.topic",
        JSON.stringify(requestMessage),
        { qos: 1, retain: true },
        (err) => {
          if (err) {
            console.error("Error al enviar solicitud:", err);
            return res
              .status(500)
              .json({ message: "Error al enviar solicitud" });
          } else {
            console.log("Solicitud enviada correctamente");
          }
        }
      );
    });

    eventEmitter.once("iotProcessed", (data) => {
      if (data.patientId === patientId) {
        return res.status(200).json({
          message: "Diagnóstico procesado y almacenado correctamente",
        });
      }
    });
  } catch (error) {
    console.error("Error al enviar solicitud:", error);
    return res.status(500).json({ message: "Error al enviar solicitud" });
  }
};

export const getPatientHistoryData = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const patientId = req.user?.id;

    if (!patientId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const history = await getPatientHistory(patientId);
    return res.status(200).json(history);
  } catch (error: any) {
    console.error("Error al obtener el historial del paciente:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener el historial del paciente" });
  }
};

export const getHistoryByPatientId = async (req: Request, res: Response) => {
  try {
    const patientId = parseInt(req.params.id, 10);

    if (isNaN(patientId)) {
      return res.status(400).json({ message: "ID de paciente inválido" });
    }

    const history = await getPatientHistory(patientId);
    return res.status(200).json(history);
  } catch (error: any) {
    console.error("Error al obtener el historial del paciente:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener el historial del paciente" });
  }
};

export const deleteHistory = async (req: Request, res: Response) => {
  try {
    const historyId = parseInt(req.params.id, 10);

    if (isNaN(historyId)) {
      return res.status(400).json({ message: "ID de historial inválido" });
    }

    await deleteHistoryById(historyId);
    return res
      .status(200)
      .json({ message: "Historial eliminado correctamente" });
  } catch (error: any) {
    console.error("Error al eliminar el historial:", error);
    return res.status(500).json({ message: "Error al eliminar el historial" });
  }
};
