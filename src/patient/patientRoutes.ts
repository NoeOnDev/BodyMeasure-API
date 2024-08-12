// src/patient/patientRoutes.ts
import { Router } from "express";
import { addPatient, getPatients, loginPatientController, deletePatientController } from "./patientController";
import authenticateJWT from "../middleware/authenticateToken";

const router = Router();

router.post('/patient', authenticateJWT, addPatient);
router.get('/patients', authenticateJWT, getPatients);
router.post('/patient/login', loginPatientController);
router.delete('/patient/:patientId', authenticateJWT, deletePatientController);

export default router;
