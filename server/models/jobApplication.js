import mongoose, { Mongoose } from "mongoose";

const schema = mongoose.Schema;

const JobApplicationSchema = new schema({
  userId: { type: String, ref: "User", required: true },
  companyId: { type: schema.Types.ObjectId, ref: "Company", required: true },
  jobId: { type: schema.Types.ObjectId, ref: "Job", required: true },
  status: { type: String, default: "panding" },
  date: { type: Number, required: true },
});

const JobApplication = mongoose.model('JobApplication', JobApplicationSchema)

export default JobApplication