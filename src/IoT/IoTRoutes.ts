import { Router } from "express";
import { getPatientIoTData, getPatientHistoryData, getHistoryByPatientId } from "./IoTController";
import authenticateJWT from "../middleware/authenticateToken";

const router = Router();

router.get('/patient/iot', authenticateJWT, getPatientIoTData);
router.get('/patient/history', authenticateJWT, getPatientHistoryData);
router.get('/patient/history/:id', authenticateJWT, getHistoryByPatientId);

export default router;
