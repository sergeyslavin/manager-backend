import mongoose from "mongoose";

export type TaskModel = mongoose.Document & {
  title: String,
  description: String
};

const taskSchema = new mongoose.Schema({
  title: String,
  description: String
}, { timestamps: true });

export const Task = mongoose.model<TaskModel>("Task", taskSchema);