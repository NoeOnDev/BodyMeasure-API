import { Request, Response } from 'express';
import { createPatient } from './patientServices';

export const addPatient = async (req: Request, res: Response) => {
    try {
        const { name, username, password, age, sex, weight, phone, email, height, responsible_doctor } = req.body;
        await createPatient({ name, username, password, age, sex, weight, phone, email, height, responsible_doctor });
        res.status(201).json({ message: 'Paciente creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el paciente:', error);
        res.status(500).json({ message: 'Error al crear el paciente' });
    }
};
