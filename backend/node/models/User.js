const mongoose = require("mongoose");

// Schema for Students
const studentSchema = new mongoose.Schema({
  S_id: { type: String, required: true, unique: true }, // e.g., s001
  Name: { type: String, required: true },
  Rllno: { type: String, required: true },
  Department: { type: String, required: true },
  Class: { type: String, required: true },
  Subject_id: { type: String, required: true },
  Test_Attendance: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now },
});

// Schema for Faculty
const facultySchema = new mongoose.Schema({
  F_id: { type: String, required: true, unique: true }, // e.g., f001
  Name: { type: String, required: true },
  Department: { type: String, required: true },
  Q_id: { type: String, required: true }, // Reference to questions
  dateCreated: { type: Date, default: Date.now },
});

// Schema for Questions
const questionSchema = new mongoose.Schema({
  Q_id: { type: String, required: true, unique: true }, // e.g., q001
  F_id: { type: String, required: true }, // Reference to faculty
  S_id: [{ type: String, required: true }], // Array of student IDs
  dateCreated: { type: Date, default: Date.now },
});

// Exporting the models
const Student = mongoose.model("Student", studentSchema);
const Faculty = mongoose.model("Faculty", facultySchema);
const Question = mongoose.model("Question", questionSchema);

module.exports = { Student, Faculty, Question };
