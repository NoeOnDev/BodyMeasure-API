import { pool } from "../config/dbConfig";
import bcrypt from 'bcrypt';

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
    } catch (error) {
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
