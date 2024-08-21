import { Router } from "express";
import { getPatientIoTData, getPatientHistoryData, getHistoryByPatientId, deleteHistory } from "./IoTController";
import authenticateJWT from "../middleware/authenticateToken";

const router = Router();

router.get('/patient/iot', authenticateJWT, getPatientIoTData);
router.get('/patient/history', authenticateJWT, getPatientHistoryData);
router.get('/patient/history/:id', authenticateJWT, getHistoryByPatientId);
router.delete('/patient/history/:id', authenticateJWT, deleteHistory);

export default router;