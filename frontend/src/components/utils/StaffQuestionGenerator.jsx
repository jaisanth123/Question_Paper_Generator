import React from "react";
import {
  FaUser,
  FaBook,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaQuestionCircle,
  FaFilter,
} from "react-icons/fa";

const StaffQuestionGenerator = ({
  staffItems,
  toggleSortByName,
  toggleSortByDate,
  filterDate,
  setFilterDate,
  filterSubject,
  setFilterSubject,
  filterStaffName,
  setFilterStaffName,
  sortByName,
  sortByDate,
  addStaffItem,
}) => {
  return (
    <div className="w-full px-4">
      <div className="p-6">
        <h2 className="text-xl font-bold text-black mb-4 text-center flex items-center justify-center">
          <FaQuestionCircle className="mr-2" /> Question Generator Staff
        </h2>

        {/* Filter and Sort Section */}
        <div className="mb-6 bg-black p-4 rounded-lg shadow-md border border-black">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Sort by Staff Name */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSortByName}
                className="flex items-center text-white hover:scale-110 duration-500 transition"
              >
                <FaUser className="mr-1 text-white" />
                Sort by Name
                {sortByName === "asc" ? (
                  <FaArrowUp className="ml-1 text-white" />
                ) : sortByName === "desc" ? (
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

            {/* Filter by Staff Name */}
            <div className="flex items-center space-x-2">
              <FaUser className="text-white" />
              <input
                type="text"
                placeholder="Filter by Staff Name"
                value={filterStaffName}
                onChange={(e) => setFilterStaffName(e.target.value)}
                className="border border-white p-1 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {/* Add Staff Item Button Card */}
          <div
            onClick={addStaffItem}
            className="h-80 bg-white border-2 border-black p-3 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-center items-center"
          >
            <FaPlus className="text-black mb-2" size={30} />
            <span className="text-sm font-semibold text-black">Add Staff</span>
          </div>

          {staffItems.map((item, index) => (
            <div
              key={index}
              className="h-80 bg-white border-2 border-black p-3 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-center items-center"
            >
              <div className="flex items-center mb-1">
                <FaUser className="text-black mr-1" />
                <span className="text-sm font-semibold text-black">
                  {item.staffName}
                </span>
              </div>
              <div className="flex items-center mb-1">
                <FaBook className="text-black mr-1" />
                <span className="text-sm text-black">{item.subject}</span>
              </div>
              <div className="flex items-center mb-1">
                <FaCalendarAlt className="text-black mr-1" />
                <span className="text-sm text-black">{item.date}</span>
              </div>
              <div className="flex items-center">
                <FaQuestionCircle className="text-black mr-1" />
                <span className="text-sm text-black">
                  {item.questionsCount} questions
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffQuestionGenerator;
