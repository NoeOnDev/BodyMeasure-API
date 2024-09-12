import { Router } from 'express';
import { addDoctor, loginDoctorController, getAllDoctorsController } from './doctorController';

const router = Router();

router.post('/doctors', addDoctor);
router.post('/doctors/login', loginDoctorController);
router.get('/doctors', getAllDoctorsController);

export default router;
