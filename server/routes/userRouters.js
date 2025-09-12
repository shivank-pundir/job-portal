import express from "express";
import { requireAuth } from "@clerk/express";
import { 
  getUserData, 
  applyForJob, 
  getUserJobApplication, 
  updateUserResume 
} from "../controllers/userController.js";

const router = express.Router();

// secure routes with requireAuth
router.get("/user",requireAuth, getUserData);
router.post("/apply", requireAuth, applyForJob);
router.get("/applications", requireAuth, getUserJobApplication);
router.put("/resume", requireAuth, updateUserResume);

export default router;
