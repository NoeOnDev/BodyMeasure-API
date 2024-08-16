import { Router } from "express";
import { getPatientIoTData, getPatientHistoryData } from "./IoTController";
import authenticateJWT from "../middleware/authenticateToken";

const router = Router();

router.get('/patient/iot', authenticateJWT, getPatientIoTData);
router.get('/patient/history', authenticateJWT, getPatientHistoryData);

export default router;
