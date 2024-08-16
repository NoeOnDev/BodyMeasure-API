import moment from 'moment-timezone';
import { pool } from "../config/dbConfig";
import { getPatientById } from "../patient/patientServices";
import { getIoTData, applyFormulas } from './utils';

const saveHistory = async (patientId: number, doctorId: number, data: any) => {
    const query = `
        INSERT INTO history (patient_id, doctor_id, date, time, age, height, mine, mm, pro, mlgt, act, bmi, icw, ecw, fm, pfm, resistance, reactance, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;
    const date = moment().tz('America/Mexico_City').format('YYYY-MM-DD');
    const time = moment().tz('America/Mexico_City').format('HH:mm:ss');
    const values = [
        patientId, doctorId, date, time, data.age, data.height, data.MINE, data.MM, data.PRO, data.MLGT, data.ACT, data.BMI, data.ICW, data.ECW, data.MG, data.PFM, data.resistance, data.reactance
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
        SELECT * FROM history WHERE patient_id = ? ORDER BY date DESC, time DESC
    `;
    const [rows] = await pool.query(query, [patientId]);
    return rows;
};
