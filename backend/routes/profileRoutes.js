import express from "express";
import { getProfile, getSession } from "../controller/profileController.js";

const router = express.Router();

// Get user profile data
router.post("/", getProfile);
router.post("/getsession", getSession);

export default router;
