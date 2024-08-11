// src/doctor/doctorService.ts
import { pool } from "../config/dbConfig";

interface Doctor {
    name: string;
    username: string;
    password: string;
}

export const createDoctor = async (doctor: Doctor) => {
    const { name, username, password } = doctor;
    const query = 'INSERT INTO doctor (name, username, password) VALUES (?, ?, ?)';
    const values = [name, username, password];

    try {
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        console.error('Error al insertar el doctor en la base de datos:', error);
        throw error;
    }
};
