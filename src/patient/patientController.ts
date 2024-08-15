// src/patient/patientController.ts
import { Request, Response } from 'express';
import { createPatient, getPatientsByDoctor, loginPatient, deletePatient, getPatientById } from './patientServices';
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
        res.status(201).json({ message: 'Paciente creado exitosamente', name: name });
    } catch (error: any) {
        if (error.message === 'El nombre de usuario ya existe. Por favor, elige uno diferente.') {
            res.status(409).json({ message: error.message });
        } else {
            console.error('Error al crear el paciente:', error);
            res.status(500).json({ message: 'Error al crear el paciente' });
        }
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

export const deletePatientController = async (req: AuthRequest, res: Response) => {
    try {
        const { patientId } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: 'Doctor no autenticado' });
        }

        const id = Number(patientId);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID de paciente inválido' });
        }

        await deletePatient(id);
        return res.status(200).json({ message: 'Paciente eliminado exitosamente' });
    } catch (error: any) {
        if (error.message === 'Paciente no encontrado') {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        } else {
            return res.status(500).json({ message: 'Error al eliminar el paciente' });
        }
    }
};

export const getPatientByIdController = async (req: AuthRequest, res: Response) => {
    try {
        const patientId = req.user?.id;

        if (!patientId) {
            return res.status(401).json({ message: 'Paciente no autenticado' });
        }

        const patient = await getPatientById(patientId);
        return res.status(200).json(patient);
    } catch (error: any) {
        if (error.message === 'Paciente no encontrado') {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        } else {
            return res.status(500).json({ message: 'Error al obtener el paciente' });
        }
    }
};
