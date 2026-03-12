import mongoose, { Schema, model, models } from "mongoose";

const JourneySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }, // URL or path
    video: { type: String }, // Optional embedded video link
    date: { type: String, required: true }, // Milestone date/year
    category: { type: String },
  },
  { timestamps: true }
);

const Journey = models.Journey || model("Journey", JourneySchema);

export default Journey;
