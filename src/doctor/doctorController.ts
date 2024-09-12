import { Request, Response } from 'express';
import { createDoctor, loginDoctor, getAllDoctors } from './doctorServices';

export const addDoctor = async (req: Request, res: Response) => {
    try {
        const { name, username, password, phone, email, age, sex } = req.body;
        await createDoctor({ name, username, password, phone, email, age, sex });
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
    } catch (error: any) {
        if (error.message === 'Usuario no encontrado') {
            res.status(404).json({ message: 'Usuario no encontrado. Por favor, verifica el nombre de usuario.' });
        } else if (error.message === 'Contraseña incorrecta') {
            res.status(401).json({ message: 'Contraseña incorrecta. Por favor, intenta de nuevo.' });
        } else {
            res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
        }
    }
};

export const getAllDoctorsController = async (_req: Request, res: Response) => {
    try {
        const doctors = await getAllDoctors();
        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error al obtener los doctores:', error);
        res.status(500).json({ message: 'Error al obtener los doctores' });
    }
};
