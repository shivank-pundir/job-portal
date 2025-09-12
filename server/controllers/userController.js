import { compare } from "bcrypt";
import JobApplication from "../models/jobApplication.js";
import User from "../models/user.js";
import Job from "../models/job.js";
import { v2 as cloudinary } from "cloudinary";

// get User data
export const getUserData = async (req, res) => {
  try {
    console.log("req.auth():", req.auth()); // 👈 check Clerk payload

    const { userId: clerkId } = req.auth();
    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(clerkId); // if _id === clerkId
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("getUserData error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth(); // ✅
    const { jobId } = req.body;

    const isAlreadyApplied = await JobApplication.find({ jobId, clerkId });
    if (isAlreadyApplied.length > 0) {
      return res.json({ success: false, message: "Already Applied" });
    }

    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.json({ success: false, message: "Job not found" });
    }

    await JobApplication.create({
      companyId: jobData.companyId,
      jobId,
      clerkId, // ✅ store clerkId instead of Mongo _id
      date: Date.now(),
    });

    res.json({ success: true, message: "Applied Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// get user applied applications
export const getUserJobApplication = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth(); // ✅

    const applications = await JobApplication.find({ clerkId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .exec();

    if (!applications || applications.length === 0) {
      return res.json({
        success: false,
        message: "No job application found for this user",
      });
    }

    res.json({ success: true, applications });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Update user Profile (resume)
export const updateUserResume = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth(); // ✅
    const resumeFile = req.file; // assuming you're using multer

    const userData = await User.findOne({ clerkId });
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    if (resumeFile) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
      userData.resume = resumeUpload.secure_url;
    }

    await userData.save();
    res.json({ success: true, message: "Resume Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
