// import React, { useState } from "react";
// import {
//   FaUpload,
//   FaFilePdf,
//   FaClipboardList,
//   FaArrowAltCircleRight,
//   FaArrowAltCircleLeft,
// } from "react-icons/fa"; // Import additional icons

// const PdfUploader = () => {
//   const [file, setFile] = useState(null);
//   const [startPage, setStartPage] = useState(1); // State for start page number
//   const [endPage, setEndPage] = useState(1); // State for end page number
//   const [extractedData, setExtractedData] = useState(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("startPage", startPage); // Append start page number
//     formData.append("endPage", endPage); // Append end page number

//     try {
//       const response = await fetch("http://localhost:3000/extract-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setExtractedData(data);
//       } else {
//         const errorText = await response.text();
//         console.error("Failed to extract PDF:", errorText);
//         alert("Failed to extract PDF: " + errorText);
//       }
//     } catch (error) {
//       console.error("Error during fetch:", error);
//       alert("Error during fetch: " + error.message);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
//         <h2 className="text-2xl font-bold mb-4 text-black">Upload PDF</h2>
//         <form onSubmit={handleSubmit} className="flex flex-col items-center">
//           <div className="mb-4 w-full flex flex-col">
//             <label className="block text-black mb-2">Choose a PDF file:</label>
//             <div className="flex items-center border border-black bg-gray-200 p-2 rounded w-full">
//               <FaFilePdf className="mr-2 text-black" />
//               <input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={handleFileChange}
//                 required
//                 className="bg-transparent border-none w-full text-black"
//               />
//             </div>
//           </div>

//           {/* Start Page Number Input */}
//           <div className="mb-4 w-full flex flex-col">
//             <label className="block text-black mb-2">Start Page No:</label>
//             <div className="flex items-center border border-black bg-gray-200 p-2 rounded w-full">
//               <FaArrowAltCircleLeft className="mr-2 text-black" />
//               <input
//                 type="number"
//                 value={startPage}
//                 onChange={(e) => setStartPage(e.target.value)}
//                 min="1"
//                 className="bg-transparent border-none w-full text-black"
//                 required
//               />
//             </div>
//           </div>

//           {/* End Page Number Input */}
//           <div className="mb-4 w-full flex flex-col">
//             <label className="block text-black mb-2">End Page No:</label>
//             <div className="flex items-center border border-black bg-gray-200 p-2 rounded w-full">
//               <FaArrowAltCircleRight className="mr-2 text-black" />
//               <input
//                 type="number"
//                 value={endPage}
//                 onChange={(e) => setEndPage(e.target.value)}
//                 min="1"
//                 className="bg-transparent border-none w-full text-black"
//                 required
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="bg-black text-white p-3 rounded w-full flex items-center justify-center hover:scale-110 duration-500 transform transition"
//           >
//             <FaUpload className="mr-2" />
//             Extract Content
//           </button>
//         </form>
//         {extractedData && (
//           <div className="mt-4 w-full">
//             <h3 className="text-lg font-bold text-black flex items-center">
//               <FaClipboardList className="mr-2 text-black" />
//               Extracted Text:
//             </h3>
//             {extractedData.text.map((text, index) => (
//               <p key={index} className="text-gray-700 w-full">
//                 {text}
//               </p>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PdfUploader;
import React, { useState, useEffect } from "react";
import axios from "axios";

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [startPage, setStartPage] = useState(0);
  const [endPage, setEndPage] = useState("");
  const [totalPages, setTotalPages] = useState(null);

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
        setStartPage(0); // Default start page
        setEndPage(totalPages - 1); // Default end page
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

  return (
    <div>
      <h2>Upload PDF & Extract Pages</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        {totalPages !== null && <p>Total Pages: {totalPages}</p>}
        <input
          type="number"
          placeholder="Start Page"
          value={startPage}
          onChange={(e) => setStartPage(parseInt(e.target.value))}
          min="0"
          max={totalPages ? totalPages - 1 : ""}
        />
        <input
          type="number"
          placeholder="End Page"
          value={endPage}
          onChange={(e) => setEndPage(parseInt(e.target.value))}
          min="0"
          max={totalPages ? totalPages - 1 : ""}
        />
        <button type="submit">Upload & Extract</button>
      </form>
    </div>
  );
};

export default PdfUploader;
