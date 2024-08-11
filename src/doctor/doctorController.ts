// src/doctor/doctorController.ts
import { Request, Response } from 'express';
import { createDoctor, loginDoctor } from './doctorServices';

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

export const loginDoctorController = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const token = await loginDoctor(username, password);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(401).json({ message: 'Credenciales inválidas' });
    }
};
