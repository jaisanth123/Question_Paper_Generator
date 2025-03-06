import React, { useState } from "react";
import axios from "axios";
import StaffQuestionGenerator from "../utils/StaffQuestionGenerator";
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

  // State for StaffQuestionGenerator component
  const [staffItems, setStaffItems] = useState([
    {
      staffName: "Dr. Smith",
      subject: "Mathematics",
      date: "2025-03-15",
      questionsCount: 25,
    },
    {
      staffName: "Prof. Johnson",
      subject: "Physics",
      date: "2025-03-10",
      questionsCount: 18,
    },
    {
      staffName: "Ms. Williams",
      subject: "Chemistry",
      date: "2025-03-05",
      questionsCount: 30,
    },
    {
      staffName: "Mr. Davis",
      subject: "Biology",
      date: "2025-03-20",
      questionsCount: 22,
    },
  ]);
  const [sortByName, setSortByName] = useState(null); // null, 'asc', or 'desc'
  const [sortByDate, setSortByDate] = useState(null); // null, 'asc', or 'desc'
  const [filterDate, setFilterDate] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStaffName, setFilterStaffName] = useState("");

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

  // Functions for StaffQuestionGenerator component
  const toggleSortByName = () => {
    if (sortByName === null) setSortByName("asc");
    else if (sortByName === "asc") setSortByName("desc");
    else setSortByName(null);
  };

  const toggleSortByDate = () => {
    if (sortByDate === null) setSortByDate("asc");
    else if (sortByDate === "asc") setSortByDate("desc");
    else setSortByDate(null);
  };

  const addStaffItem = () => {
    const newItem = {
      staffName: "New Staff",
      subject: "New Subject",
      date: new Date().toISOString().split("T")[0],
      questionsCount: 0,
    };
    setStaffItems([...staffItems, newItem]);
  };

  // Filter and sort the staff items
  let filteredStaffItems = [...staffItems];

  // Apply filters
  if (filterDate) {
    filteredStaffItems = filteredStaffItems.filter(
      (item) => item.date === filterDate
    );
  }

  if (filterSubject) {
    filteredStaffItems = filteredStaffItems.filter((item) =>
      item.subject.toLowerCase().includes(filterSubject.toLowerCase())
    );
  }

  if (filterStaffName) {
    filteredStaffItems = filteredStaffItems.filter((item) =>
      item.staffName.toLowerCase().includes(filterStaffName.toLowerCase())
    );
  }

  // Apply sorting
  if (sortByName) {
    filteredStaffItems.sort((a, b) => {
      return sortByName === "asc"
        ? a.staffName.localeCompare(b.staffName)
        : b.staffName.localeCompare(a.staffName);
    });
  }

  if (sortByDate) {
    filteredStaffItems.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return sortByDate === "asc"
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mb-8">
        <h2 className="text-2xl font-bold mb-4 text-black text-center">
          <u>Upload PDF & Extract Pages</u>
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="mb-4 w-full flex items-center">
            <FaFilePdf className="mr-2 text-black text-3xl" />
            <label className="text-black">
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
            <FaArrowAltCircleLeft className="mr-2 text-black text-3xl" />
            <label className="text-black">
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
            <FaArrowAltCircleRight className="mr-2 text-black text-3xl" />
            <label className="text-black">
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
              <FaLayerGroup className="mr-2 text-black text-2xl" />
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

      {/* Pass all required props to StaffQuestionGenerator component instead of ExamInfo */}
      <StaffQuestionGenerator
        staffItems={filteredStaffItems}
        toggleSortByName={toggleSortByName}
        toggleSortByDate={toggleSortByDate}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        filterSubject={filterSubject}
        setFilterSubject={setFilterSubject}
        filterStaffName={filterStaffName}
        setFilterStaffName={setFilterStaffName}
        sortByName={sortByName}
        sortByDate={sortByDate}
        addStaffItem={addStaffItem}
      />
    </div>
  );
};

export default PdfUploader;
