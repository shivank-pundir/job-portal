import { compare } from "bcrypt";
import JobApplication from "../models/jobApplication.js";
import User from "../models/user.js";
import Job from "../models/job.js";
import { v2 as cloudinary } from "cloudinary";

// Get User data
export const getUserData = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();
    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findOne({ _id: clerkId });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("getUserData error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sync user from Clerk
export const syncUserFromClerk = async (req, res) => {
  try {
    console.log('🔄 syncUserFromClerk called');
    
    // Get the authorization header
    const authHeader = req.headers.authorization;
    console.log('📥 Auth header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization header');
      return res.status(401).json({ success: false, message: "No valid token provided" });
    }
    
    // Extract the token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log(' Token extracted:', token.substring(0, 50) + '...');
    
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.sub; // 'sub' contains the user ID
      console.log(' Extracted user ID from token:', userId);
      console.log('📋 Full token payload:', tokenPayload);
      
      // Extract name from token
      let name = 'Anonymous';
      if (tokenPayload.first_name && tokenPayload.last_name) {
        name = `${tokenPayload.first_name} ${tokenPayload.last_name}`.trim();
      } else if (tokenPayload.first_name) {
        name = tokenPayload.first_name;
      } else if (tokenPayload.last_name) {
        name = tokenPayload.last_name;
      } else if (tokenPayload.name) {
        name = tokenPayload.name;
      }
      
      // Ensure name is not null or undefined
      if (!name || name === 'null' || name === 'undefined') {
        name = 'Anonymous';
      }
      
      console.log('📝 Extracted data:', { id: userId, email: tokenPayload.email, name });
      
      // Check if user exists in MongoDB
      let user = await User.findOne({ _id: userId });
      
      if (!user) {
        console.log('❌ User not found, creating new user...');
        // Create new user with data from token
        user = await User.create({
          _id: userId,
          email: tokenPayload.email || 'no-email@example.com',
          name: name,
          image: tokenPayload.image_url || '',
          resume: ''
        });
        console.log('✅ New user created:', user);
      } else {
        console.log('✅ User found, checking for updates...');
        
        // Update existing user with missing fields
        if (!user.image || !user.resume || !user.name || user.name === 'Anonymous') {
          user.email = user.email || tokenPayload.email || 'no-email@example.com';
          user.name = name;
          user.image = user.image || tokenPayload.image_url || '';
          user.resume = user.resume || '';
          await user.save();
          console.log('✅ User updated with missing fields:', user);
        } else {
          console.log('✅ User is up to date');
        }
      }

      console.log('✅ Returning user data:', user);
      res.json({ success: true, user });
    } catch (tokenError) {
      console.error('❌ Token decoding error:', tokenError);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    
  } catch (error) {
    console.error("❌ syncUserFromClerk error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();
    const { jobId } = req.body;

    const existingApplication = await JobApplication.findOne({
      clerkId,
      jobId,
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: "Already applied" });
    }

    const jobApplication = await JobApplication.create({
      clerkId,
      jobId,
    });

    await jobApplication.save();

    res.status(200).json({ success: true, message: "Job applied successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user job applications
export const getUserJobApplication = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();

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


// Update user resume
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId // ✅ get Clerk userId correctly

    
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Ensure file exists
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const resumeUpload = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
    });

    // Update user resume
    userData.resume = resumeUpload.secure_url;
    await userData.save();

    return res.json({
      success: true,
      message: "Resume Updated",
      resume: userData.resume,
    });
  } catch (error) {
    console.error("updateUserResume error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

