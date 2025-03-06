const fs = require('fs');
const path = require('path');
const express = require('express');
const { PDFDocument } = require('pdf-lib');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const cors = require("cors");

const app = express();
const upload = multer({ dest: 'uploads/' });

// Set up middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // Allow only your frontend
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.urlencoded({ extended: true }));

// PDF Upload and Split endpoint
app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const { startPage, endPage } = req.body;
    const inputPath = req.file.path;
    const outputPath = path.join(__dirname, "temp_output.pdf");
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:5000/process_pdf';

    if (!startPage || !endPage || isNaN(startPage) || isNaN(endPage)) {
      return res.status(400).json({ error: "Invalid page numbers" });
    }

    const start = parseInt(startPage) - 1;
    const end = parseInt(endPage) - 1;

    console.log(`Splitting PDF from page ${start} to ${end}`);

    // Load the input PDF
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();

    if (start < 0 || end > totalPages - 1 || start > end) {
      return res.status(400).json({ error: "Invalid page range" });
    }

    // Create a new PDF document with the selected pages
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(
      pdfDoc,
      Array.from({ length: end - start + 1 }, (_, i) => start + i)
    );
    copiedPages.forEach((page) => newPdf.addPage(page));

    // Save the split PDF
    const pdfBytesOutput = await newPdf.save();
    fs.writeFileSync(outputPath, pdfBytesOutput);
    
    console.log(`PDF split complete. Sending to Python backend for OCR processing...`);

    // Send the split PDF to Python backend for OCR processing
    const formData = new FormData();
    formData.append('pdf', fs.createReadStream(outputPath), {
      filename: 'split_pdf.pdf',
      contentType: 'application/pdf'
    });
    
    // Send to Python backend
    const pythonResponse = await axios.post(pythonBackendUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      responseType: 'arraybuffer'
    });
    
    // Send the OCR processed PDF to the client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=processed_document.pdf');
    res.send(pythonResponse.data);

    // Clean up temporary files
    setTimeout(() => {
      try {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      } catch (err) {
        console.error("Error cleaning up files:", err);
      }
    }, 1000);
    
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Something went wrong while processing the PDF" });
  }
});

// Endpoint to get total page count
app.post("/page-count", upload.single("pdf"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();

    fs.unlinkSync(inputPath); // Clean up uploaded file
    res.json({ totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get page count" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});