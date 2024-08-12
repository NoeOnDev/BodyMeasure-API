// src/patient/patientServices.ts
import { pool } from "../config/dbConfig";
import { ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from "../config/envConfig";

interface Patient {
    name: string;
    username: string;
    password: string;
    age: number;
    sex: string;
    weight?: number;
    phone?: string;
    email?: string;
    height?: number;
    responsible_doctor: number;
}

export const createPatient = async (patient: Patient) => {
    const { name, username, password, age, sex, weight, phone, email, height, responsible_doctor } = patient;
    const saltRounds = 10;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = 'INSERT INTO patients (name, username, password, age, sex, weight, phone, email, height, responsible_doctor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [name, username, hashedPassword, age, sex, weight, phone, email, height, responsible_doctor];

        const [result] = await pool.query(query, values);
        return result;
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('El nombre de usuario ya existe. Por favor, elige uno diferente.');
        }
        console.error('Error al insertar el paciente en la base de datos:', error);
        throw error;
    }
};

export const getPatientsByDoctor = async (doctorId: number) => {
    try {
        const query = 'SELECT * FROM patients WHERE responsible_doctor = ?';
        const [rows] = await pool.query(query, [doctorId]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los pacientes del doctor:', error);
        throw error;
    }
};

export const loginPatient = async (username: string, password: string) => {
    try {
        const query = 'SELECT patient_id, name, username, password FROM patients WHERE username = ?';
        const [rows]: any = await pool.query(query, [username]);

        if (rows.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        const patient = rows[0];
        const isPasswordValid = await bcrypt.compare(password, patient.password);

        if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta');
        }

        const jwtSecret = env.jwt.jwtSecret || 'defaultSecret';
        const token = jwt.sign(
            { id: patient.patient_id, name: patient.name, username: patient.username },
            jwtSecret,
            { expiresIn: env.jwt.jwtExpiration }
        );

        return token;
    } catch (error: any) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};

export const deletePatient = async (patientId: number) => {
    try {
        const query = 'DELETE FROM patients WHERE patient_id = ?';
        const [result, _]: [ResultSetHeader, any] = await pool.query(query, [patientId]);

        if (result.affectedRows === 0) {
            throw new Error('Paciente no encontrado');
        }

        return result;
    } catch (error) {
        console.error('Error al eliminar el paciente:', error);
        throw error;
    }
};
