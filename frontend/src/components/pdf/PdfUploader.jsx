import React, { useState } from "react";

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/extract-pdf", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setExtractedData(data);
      } else {
        const errorText = await response.text();
        console.error("Failed to extract PDF:", errorText);
        alert("Failed to extract PDF: " + errorText);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Error during fetch: " + error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Upload PDF</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Extract Content
        </button>
      </form>
      {extractedData && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Extracted Text:</h3>
          {extractedData.text.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
