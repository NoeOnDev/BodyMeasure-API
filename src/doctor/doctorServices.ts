import { pool } from "../config/dbConfig";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from "../config/envConfig";

interface Doctor {
    name: string;
    username: string;
    password: string;
}

export const createDoctor = async (doctor: Doctor) => {
    const { name, username, password } = doctor;
    const saltRounds = 10;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = 'INSERT INTO doctor (name, username, password) VALUES (?, ?, ?)';
        const values = [name, username, hashedPassword];

        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        console.error('Error al insertar el doctor en la base de datos:', error);
        throw error;
    }
};

export const loginDoctor = async (username: string, password: string) => {
    try {
        const query = 'SELECT id, username, password FROM doctor WHERE username = ?';
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
            { id: doctor.id, username: doctor.username },
            jwtSecret,
            { expiresIn: env.jwt.jwtExpiration }
        );

        return token;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};
