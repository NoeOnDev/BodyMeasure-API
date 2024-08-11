import { Router } from "express";
import { addPatient } from "./patientController";
import authenticateJWT from "../middleware/authenticateToken";

const router = Router();

router.post('/patient', authenticateJWT, addPatient);

export default router;
