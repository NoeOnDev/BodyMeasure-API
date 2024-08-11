import { Router } from "express";
import { addPatient, getPatients } from "./patientController";
import authenticateJWT from "../middleware/authenticateToken";

const router = Router();

router.post('/patient', authenticateJWT, addPatient);
router.get('/patients', authenticateJWT, getPatients);

export default router;
