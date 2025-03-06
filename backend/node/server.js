const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const pdfjsLib = require("pdfjs-dist");
const app = express();
const PORT = 3000;
const path = require("path");

// Use cors to allow all origins
app.use(cors());

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

app.post("/extract-pdf", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;

  console.log("Uploaded file:", req.file);

  // Validate file type
  if (req.file.mimetype !== "application/pdf") {
    return res.status(400).send("Uploaded file is not a PDF.");
  }

  try {
    const loadingTask = pdfjsLib.getDocument(filePath);
    const pdfDoc = await loadingTask.promise;

    // Log the number of pages in the PDF
    console.log("Number of pages in PDF:", pdfDoc.numPages);

    const extractedData = {
      text: [],
    };

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      extractedData.text.push(pageText);
    }

    fs.unlinkSync(filePath); // Remove the uploaded file
    res.json(extractedData); // Send extracted data as JSON
  } catch (error) {
    console.error("Error loading PDF:", error);
    res.status(500).send("Error extracting PDF");
  }
});

app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const { startPage, endPage } = req.body;
    const inputPath = req.file.path;
    const outputPath = path.join(__dirname, "output.pdf");

    if (!startPage || !endPage || isNaN(startPage) || isNaN(endPage)) {
      return res.status(400).json({ error: "Invalid page numbers" });
    }

    const start = parseInt(startPage);
    const end = parseInt(endPage);

    // Load the input PDF
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();

    if (start < 0 || end > totalPages - 1 || start > end) {
      return res.status(400).json({ error: "Invalid page range" });
    }

    // Create a new PDF document
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(
      pdfDoc,
      Array.from({ length: end - start + 1 }, (_, i) => start + i)
    );
    copiedPages.forEach((page) => newPdf.addPage(page));

    // Save the new PDF
    const pdfBytesOutput = await newPdf.save();
    fs.writeFileSync(outputPath, pdfBytesOutput);

    res.download(outputPath, "extracted.pdf", (err) => {
      if (err) console.error(err);
      fs.unlinkSync(inputPath); // Clean up input file
      fs.unlinkSync(outputPath); // Clean up output file
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
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
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
