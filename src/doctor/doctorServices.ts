// src/doctor/doctorServices.ts
import { pool } from "../config/dbConfig";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from "../config/envConfig";

interface Doctor {
    name: string;
    username: string;
    password: string;
    phone?: string;
    email?: string;
    age?: number;
    sex: 'Femenino' | 'Masculino';
}

export const createDoctor = async (doctor: Doctor) => {
    const { name, username, password, phone, email, age, sex } = doctor;
    const saltRounds = 10;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = `INSERT INTO doctor (name, username, password, phone, email, age, sex) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [name, username, hashedPassword, phone, email, age, sex];

        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        console.error('Error al insertar el doctor en la base de datos:', error);
        throw error;
    }
};

export const loginDoctor = async (username: string, password: string) => {
    try {
        const query = 'SELECT doctor_id, name, username, password FROM doctor WHERE username = ?';
        const [rows]: any = await pool.query(query, [username]);

        if (rows.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        const doctor = rows[0];
        const isPasswordValid = await bcrypt.compare(password, doctor.password);

        if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta');
        }

        const jwtSecret = env.jwt.jwtSecret || 'defaultSecret';
        const token = jwt.sign(
            { id: doctor.doctor_id, name: doctor.name, username: doctor.username },
            jwtSecret,
            { expiresIn: env.jwt.jwtExpiration }
        );

        return token;
    } catch (error: any) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};

export const getAllDoctors = async () => {
    try {
        const query = 'SELECT doctor_id, name, username, phone, email, age, sex FROM doctor';
        const [rows]: any = await pool.query(query);

        return rows;
    } catch (error) {
        console.error('Error al obtener los doctores:', error);
        throw error;
    }
};
