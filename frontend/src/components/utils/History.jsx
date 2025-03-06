import React, { useState } from "react";
import ExamInfo from "./ExamInfo";
import StaffQuestionGenerator from "./StaffQuestionGenerator";

const History = () => {
  const [items, setItems] = useState([]); // State for ExamInfo items
  const [staffItems, setStaffItems] = useState([]); // State for StaffQuestionGenerator items
  const [sortByName, setSortByName] = useState(null); // Sorting state for staff
  const [sortByDate, setSortByDate] = useState(null); // Sorting state for exam items
  const [filterDate, setFilterDate] = useState(""); // Filter state for date
  const [filterSubject, setFilterSubject] = useState(""); // Filter state for subject
  const [filterStaffName, setFilterStaffName] = useState(""); // Filter state for staff name

  const toggleSortByName = () => {
    setSortByName((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const toggleSortByDate = () => {
    setSortByDate((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-6">History</h2>

      {/* Exam Info Component - Full Width Top */}
      <div className="w-full mb-8 bg-white rounded shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Exam History</h3>
        <ExamInfo
          items={items}
          toggleSortByMarks={() => {}}
          toggleSortByDate={toggleSortByDate}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          filterSubject={filterSubject}
          setFilterSubject={setFilterSubject}
          sortByMarks={null} // Assuming no sorting by marks in history
          sortByDate={sortByDate}
          addItem={() => {}} // Placeholder for addItem function
        />
      </div>

      {/* Staff Question Generator Component - Full Width Bottom */}
      <div className="w-full bg-white rounded shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Staff Questions</h3>
        <StaffQuestionGenerator
          staffItems={staffItems}
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
          addStaffItem={() => {}} // Placeholder for addStaffItem function
        />
      </div>
    </div>
  );
};

export default History;
    