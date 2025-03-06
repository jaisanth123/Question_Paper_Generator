import React, { useState } from "react";
import axios from "axios";
import {
  FaFilePdf,
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaUpload,
  FaLayerGroup,
} from "react-icons/fa"; // Importing icons

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState("");
  const [totalPages, setTotalPages] = useState(null);
  const [percentages, setPercentages] = useState(Array(5).fill("")); // State for percentage inputs

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const formData = new FormData();
      formData.append("pdf", selectedFile);

      try {
        const response = await axios.post(
          "http://localhost:3000/page-count",
          formData
        );
        const { totalPages } = response.data;
        setTotalPages(totalPages);
        setStartPage(1); // Default start page set to 1
        setEndPage(totalPages); // Default end page set to total pages
      } catch (error) {
        console.error("Error fetching page count:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || startPage === "" || endPage === "") {
      alert("Please upload a file and enter valid page numbers.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("startPage", startPage);
    formData.append("endPage", endPage);
    percentages.forEach((percentage, index) => {
      formData.append(`K${index + 1}`, percentage); // Append each percentage to form data
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          responseType: "blob", // Expect a file response
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "output.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handlePercentageChange = (index, value) => {
    const newPercentages = [...percentages];
    newPercentages[index] = value;
    setPercentages(newPercentages);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-black text-center">
          <u>Upload PDF & Extract Pages</u>
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="mb-4 w-full flex items-center">
            <FaFilePdf className="mr-2 text-black text-3xl" />{" "}
            {/* Increased icon size */}
            <label className="text-black">
              {" "}
              <b>
                <u>Choose a PDF file:</u>
              </b>
            </label>
          </div>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mb-4 border border-black p-2 rounded w-full"
          />
          {totalPages !== null && (
            <p className="text-black mb-4">Total Pages: {totalPages}</p>
          )}
          <div className="mb-4 w-full flex items-center">
            <FaArrowAltCircleLeft className="mr-2 text-black text-3xl" />{" "}
            {/* Increased icon size */}
            <label className="text-black">
              {" "}
              <b>
                <u>Start Page:</u>
              </b>
            </label>
          </div>
          <input
            type="number"
            placeholder="Start Page"
            value={startPage}
            onChange={(e) => setStartPage(parseInt(e.target.value))}
            min="1"
            max={totalPages ? totalPages : ""}
            className="mb-4 border border-black p-2 rounded w-full"
          />
          <div className="mb-4 w-full flex items-center">
            <FaArrowAltCircleRight className="mr-2 text-black text-3xl" />{" "}
            {/* Increased icon size */}
            <label className="text-black">
              {" "}
              <b>
                <u>End Page:</u>
              </b>
            </label>
          </div>
          <input
            type="number"
            placeholder="End Page"
            value={endPage}
            onChange={(e) => setEndPage(parseInt(e.target.value))}
            min="1"
            max={totalPages ? totalPages : ""}
            className="mb-4 border border-black p-2 rounded w-full"
          />
          <div className="mb-4 w-full flex flex-col">
            <label className="text-black mb-2 flex items-center">
              <FaLayerGroup className="mr-2 text-black text-2xl" />{" "}
              {/* Levels icon */}
              <b>
                <u>K Levels:</u>
              </b>
            </label>
            <div className="flex justify-between">
              {percentages.map((percentage, index) => (
                <input
                  key={index}
                  type="number"
                  placeholder={`K${index + 1}`}
                  value={percentage}
                  onChange={(e) =>
                    handlePercentageChange(index, e.target.value)
                  }
                  className="border border-black p-2 rounded w-full mx-1"
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-black text-white p-3 rounded w-full flex items-center justify-center hover:scale-110 duration-500 transition"
          >
            <FaUpload className="mr-2" />
            Upload & Extract
          </button>
        </form>
      </div>
    </div>
  );
};

export default PdfUploader;
