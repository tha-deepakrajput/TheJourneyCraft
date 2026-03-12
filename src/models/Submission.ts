import mongoose, { Schema, model, models } from "mongoose";

const SubmissionSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    story: { type: String, required: true },
    images: { type: [String] },
    video: { type: String },
    category: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Submission = models.Submission || model("Submission", SubmissionSchema);
export default Submission;
