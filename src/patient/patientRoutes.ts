import { Router } from "express";
import { addPatient } from "./patientController";

const router = Router();

router.post('/patient', addPatient);

export default router;
