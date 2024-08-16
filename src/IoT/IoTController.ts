import { Response } from 'express';
import { processPatientData, getPatientHistory } from './IoTService';
import { AuthRequest } from '../middleware/authenticateToken';
import { getPatientById } from '../patient/patientServices';

export const getPatientIoTData = async (req: AuthRequest, res: Response) => {
    try {
        const patientId = req.user?.id;

        if (!patientId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        const patient = await getPatientById(patientId);
        const doctorId = patient.responsible_doctor;

        const results = await processPatientData(patientId, doctorId);
        return res.status(200).json(results);
    } catch (error: any) {
        console.error('Error al procesar los datos del paciente:', error);
        return res.status(500).json({ message: 'Error al procesar los datos del paciente' });
    }
};

export const getPatientHistoryData = async (req: AuthRequest, res: Response) => {
    try {
        const patientId = req.user?.id;

        if (!patientId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        const history = await getPatientHistory(patientId);
        return res.status(200).json(history);
    } catch (error: any) {
        console.error('Error al obtener el historial del paciente:', error);
        return res.status(500).json({ message: 'Error al obtener el historial del paciente' });
    }
};
