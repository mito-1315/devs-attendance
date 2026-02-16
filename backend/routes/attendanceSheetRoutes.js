import express from "express";
import { informations, clearCache, display, commit, addOnSpot } from '../controller/attendanceSheetController.js';

const router=express.Router()

router.get('/',informations);
router.delete('/cache', clearCache);
router.get('/display', display);
router.post('/commit',commit);
router.post('/addonspot', addOnSpot);

export default router;