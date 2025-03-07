const express = require("express");
const router = express.Router();
const {
  uploadAndSplitPDF,
  getPageCount,
} = require("../controllers/pdfController"); // Import the controller
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

// PDF Upload and Split endpoint
router.post("/upload", upload.single("pdf"), uploadAndSplitPDF);

// Page Count endpoint
router.post("/page-count", upload.single("pdf"), getPageCount);

module.exports = router;
