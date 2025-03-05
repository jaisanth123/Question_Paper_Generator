const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfjsLib = require("pdfjs-dist");
const app = express();
const PORT = 3001;

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

app.listen(PORT, () => {
  console.error(`Server is running at ${PORT}`);
});
