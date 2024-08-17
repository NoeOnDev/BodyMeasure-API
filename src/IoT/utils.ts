import axios from 'axios';

interface IoTData {
    resistance: number;
    reactance: number;
}

export const getIoTData = async (): Promise<IoTData> => {
    try {
        const response = await axios.get('http://localhost:5000/read_adc');
        const data = response.data;

        const resistance = parseFloat(data.R.replace('Ω', ''));
        const reactance = parseFloat(data.XC.replace('Ω', ''));

        return { resistance, reactance };
    } catch (error) {
        console.error('Error al obtener los datos del dispositivo IoT:', error);
        throw new Error('Error al obtener los datos del dispositivo IoT');
    }
};

const roundToTwoDecimals = (num: number) => Math.round(num * 100) / 100;

export const applyFormulas = (height: number, weight: number, sex: string, resistance: number, reactance: number) => {
    let MLG, MLG2, MLG3;
    if (sex === 'Femenino') {
        MLG = -4.104 + (0.518 * ((height ** 2) / resistance)) + (0.231 * weight) + (0.130 * reactance) + (4.229 * 0);
        MLG2 = -4.036 + (0.517 * ((height ** 2) / resistance)) + (0.238 * weight) + (0.123 * reactance) + (4.07 * 0);
        MLG3 = -4.104 + (0.518 * ((height ** 2) / resistance)) + (0.231 * weight) + (0.130 * reactance) + (4.229 * 0);
    } else {
        MLG = -4.204 + (0.518 * ((height ** 2) / resistance)) + (0.231 * weight) + (0.130 * reactance) + (4.229 * 1);
        MLG2 = -4.036 + (0.517 * ((height ** 2) / resistance)) + (0.238 * weight) + (0.123 * reactance) + (4.07 * 1);
        MLG3 = -4.204 + (0.518 * ((height ** 2) / resistance)) + (0.231 * weight) + (0.130 * reactance) + (4.229 * 1);
    }

    const MLGT = (MLG + MLG2 + MLG3) / 3.123;
    const ACT = 0.73 * MLGT;
    const ICW = MLGT * 0.44;
    const ECW = MLGT * 0.29;
    const MINE = MLGT * 0.07;
    const MG = weight - MLGT + 1;
    const PFM = (MG / weight) * 100;
    const BMI = (weight / ((height / 100) ** 2));
    const MM = (height ** 2 / resistance) / 2;
    const PRO = weight - ACT - MINE - MG;

    return {
        MLGT: roundToTwoDecimals(MLGT),
        ACT: roundToTwoDecimals(ACT),
        ICW: roundToTwoDecimals(ICW),
        ECW: roundToTwoDecimals(ECW),
        MINE: roundToTwoDecimals(MINE),
        MG: roundToTwoDecimals(MG),
        PFM: roundToTwoDecimals(PFM),
        BMI: roundToTwoDecimals(BMI),
        MM: roundToTwoDecimals(MM),
        PRO: roundToTwoDecimals(PRO)
    };
};
