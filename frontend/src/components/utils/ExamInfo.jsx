import React from "react";
import {
  FaBook,
  FaClipboardCheck,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
} from "react-icons/fa";

const ExamInfo = ({
  items,
  toggleSortByMarks,
  toggleSortByDate,
  filterDate,
  setFilterDate,
  filterSubject,
  setFilterSubject,
  sortByMarks,
  sortByDate,
  addItem,
}) => {
  return (
    <div className="w-full px-4">
      <div className="p-6">
        <h2 className="text-xl font-bold text-black mb-4 text-center flex items-center justify-center">
          <FaBook className="mr-2" /> Additional Items
        </h2>

        {/* Filter and Sort Section */}
        <div className="mb-6 bg-black p-4 rounded-lg shadow-md border border-black">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Sort by Marks */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSortByMarks}
                className="flex items-center text-white hover:scale-110 duration-500 transition"
              >
                <FaClipboardCheck className="mr-1 text-white" />
                Sort by Marks
                {sortByMarks === "asc" ? (
                  <FaArrowUp className="ml-1 text-white" />
                ) : sortByMarks === "desc" ? (
                  <FaArrowDown className="ml-1 text-white" />
                ) : null}
              </button>
            </div>

            {/* Sort by Date */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSortByDate}
                className="flex items-center text-white hover:scale-110 duration-500 transition"
              >
                <FaCalendarAlt className="mr-1 text-white" />
                Sort by Date
                {sortByDate === "asc" ? (
                  <FaArrowUp className="ml-1 text-white" />
                ) : sortByDate === "desc" ? (
                  <FaArrowDown className="ml-1 text-white" />
                ) : null}
              </button>
            </div>

            {/* Filter by Date */}
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-white" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border border-white p-1 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            {/* Filter by Subject */}
            <div className="flex items-center space-x-2">
              <FaBook className="text-white" />
              <input
                type="text"
                placeholder="Filter by Subject"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="border border-white p-1 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {/* Add Item Button Card */}
          <div
            onClick={addItem}
            className="h-80 bg-white border-2 border-black p-3 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-center items-center"
          >
            <FaPlus className="text-balck mb-2" size={30} />
            <span className="text-sm font-semibold text-black">Add Item</span>
          </div>

          {items.map((item, index) => (
            <div
              key={index}
              className="h-80 bg-white border-2 border-black p-3 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-center items-center"
            >
              <div className="flex items-center mb-1">
                <FaBook className="text-black mr-1" />
                <span className="text-sm font-semibold text-black">
                  {item.subject}
                </span>
              </div>
              <div className="flex items-center mb-1">
                <FaClipboardCheck className="text-black mr-1" />
                <span className="text-sm text-black">{item.marks}</span>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="text-black mr-1" />
                <span className="text-sm text-black">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamInfo;
