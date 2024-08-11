// src/doctor/doctorRoutes.ts
import { Router } from 'express';
import { addDoctor, loginDoctorController } from './doctorController';

const router = Router();

router.post('/doctors', addDoctor);
router.post('/doctors/login', loginDoctorController);

export default router;
