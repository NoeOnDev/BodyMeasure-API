// src/doctor/doctorController.ts
import { Request, Response } from 'express';
import { createDoctor } from './doctorServices';

export const addDoctor = async (req: Request, res: Response) => {
    try {
        const { name, username, password } = req.body;
        await createDoctor({ name, username, password });
        res.status(201).json({ message: 'Doctor creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el doctor:', error);
        res.status(500).json({ message: 'Error al crear el doctor' });
    }
};