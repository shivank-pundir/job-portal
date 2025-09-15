import express from "express";
import { requireAuth } from "@clerk/express";
import { 
  getUserData, 
  applyForJob, 
  getUserJobApplication, 
  updateUserResume,
  syncUserFromClerk
} from "../controllers/userController.js";

const router = express.Router();

// User routes with authentication
router.get("/user", requireAuth, getUserData);
// Temporarily remove requireAuth from sync route
router.get("/sync", syncUserFromClerk);
router.post("/apply", requireAuth, applyForJob);
router.get("/applications", requireAuth, getUserJobApplication);
router.post("/resume", requireAuth, updateUserResume);

// Test route without authentication
router.get("/test", (req, res) => {
  console.log('🧪 User route test hit');
  res.json({ 
    message: 'User route test successful',
    timestamp: new Date().toISOString()
  });
});

export default router;
