import express from "express";
import { getProfile } from "../controller/profileController.js";

const router = express.Router();

// Get user profile data
router.post("/", getProfile);

export default router;
