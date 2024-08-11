import { Router } from "express";
import { addPatient, getPatients, loginPatientController } from "./patientController";
import authenticateJWT from "../middleware/authenticateToken";

const router = Router();

router.post('/patient', authenticateJWT, addPatient);
router.get('/patients', authenticateJWT, getPatients);
router.post('/patient/login', loginPatientController);

export default router;