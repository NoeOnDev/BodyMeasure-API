import moment from 'moment-timezone';
import { pool } from "../config/dbConfig";
import { getPatientById } from "../patient/patientServices";
import { getIoTData, applyFormulas } from './utils';

const saveHistory = async (patientId: number, doctorId: number, data: any) => {
    const query = `
        INSERT INTO history (patient_id, doctor_id, date, time, age, height, mine, mm, pro, mlgt, act, imc, icw, ecw, mg, pmg, resistance, reactance, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;
    const date = moment().tz('America/Mexico_City').format('YYYY-MM-DD');
    const time = moment().tz('America/Mexico_City').format('HH:mm:ss');
    const values = [
        patientId, doctorId, date, time, data.age, data.height, data.MINE, data.MM, data.PRO, data.MLGT, data.ACT, data.IMC, data.ICW, data.ECW, data.MG, data.PMG, data.resistance, data.reactance
    ];
    await pool.query(query, values);
};

export const processPatientData = async (patientId: number, doctorId: number) => {
    const patient = await getPatientById(patientId);
    const iotData = await getIoTData();
    const results = applyFormulas(patient.height, patient.weight, patient.sex, iotData.resistance, iotData.reactance);
    await saveHistory(patientId, doctorId, { ...results, age: patient.age, height: patient.height, resistance: iotData.resistance, reactance: iotData.reactance });
    return results;
};

export const getPatientHistory = async (patientId: number) => {
    const query = `
        SELECT 
            h.*, 
            p.name AS patient_name, 
            p.sex AS patient_sex,
            d.name AS doctor_name 
        FROM 
            history h
        JOIN 
            patients p ON h.patient_id = p.patient_id
        JOIN 
            doctor d ON h.doctor_id = d.doctor_id
        WHERE 
            h.patient_id = ? 
        ORDER BY 
            h.date DESC, h.time DESC
    `;
    const [rows] = await pool.query(query, [patientId]);
    return rows;
};

export const deleteHistoryById = async (historyId: number) => {
    const query = `DELETE FROM history WHERE history_id = ?`;
    await pool.query(query, [historyId]);
};
