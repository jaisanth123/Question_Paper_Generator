const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/authController"); // Import the controller

// User login endpoint
router.post("/login", loginUser);

module.exports = router;
