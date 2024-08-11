import { Request, Response } from 'express';
import { createPatient, getPatientsByDoctor, loginPatient } from './patientServices';
import { AuthRequest } from '../middleware/authenticateToken';

export const addPatient = async (req: AuthRequest, res: Response) => {
    try {
        const { name, username, password, age, sex, weight, phone, email, height } = req.body;
        const responsible_doctor = req.user?.id;

        if (!responsible_doctor) {
            res.status(400).json({ message: 'Doctor no autenticado' });
            return;
        }

        await createPatient({ name, username, password, age, sex, weight, phone, email, height, responsible_doctor });
        res.status(201).json({ message: 'Paciente creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el paciente:', error);
        res.status(500).json({ message: 'Error al crear el paciente' });
    }
};

export const getPatients = async (req: AuthRequest, res: Response) => {
    try {
        const responsible_doctor = req.user?.id;

        if (!responsible_doctor) {
            res.status(400).json({ message: 'Doctor no autenticado' });
            return;
        }

        const patients = await getPatientsByDoctor(responsible_doctor);
        res.status(200).json(patients);
    } catch (error) {
        console.error('Error al obtener los pacientes:', error);
        res.status(500).json({ message: 'Error al obtener los pacientes' });
    }
};

export const loginPatientController = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const token = await loginPatient(username, password);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(401).json({ message: 'Credenciales inválidas' });
    }
};
