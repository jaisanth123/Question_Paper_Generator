const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth"); // Import auth routes
const pdfRoutes = require("./routes/pdf"); // Import pdf routes

const app = express();

// Set up middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only your frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://Jai:asdfghjkl123@hacknovate.dhqeh.mongodb.net/?retryWrites=true&w=majority&appName=Hacknovate"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use routes
app.use("/api/auth", authRoutes); // Prefix for auth routes
app.use("/api/pdf", pdfRoutes); // Prefix for PDF routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});