import React, { useState, useRef } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
} from "react-icons/fa";
import ExamInfo from "./ExamInfo"; // Import the new ExamInfo component

const Profile = () => {
  const [items, setItems] = useState([]);
  const itemsRef = useRef(null);
  const [sortByMarks, setSortByMarks] = useState(null); // null, 'asc', 'desc'
  const [sortByDate, setSortByDate] = useState(null); // null, 'asc', 'desc'
  const [filterDate, setFilterDate] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  const addItem = () => {
    const newItems = [
      ...items,
      {
        subject: "New Subject", // You can customize this
        marks: "0/100", // Default marks
        date: new Date().toISOString().split("T")[0], // Today's date
      },
    ];
    setItems(newItems);

    // Removed scrolling feature
    // setTimeout(() => {
    //   itemsRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, 100); // Small delay to ensure DOM updates
  };

  // Sorting and Filtering Logic
  const getSortedAndFilteredItems = () => {
    let filteredItems = [...items];
    console.log("Filtered Items:", filteredItems); // Add this line to debug

    // Filter by date
    if (filterDate) {
      filteredItems = filteredItems.filter((item) => item.date === filterDate);
    }

    // Filter by subject
    if (filterSubject) {
      filteredItems = filteredItems.filter((item) =>
        item.subject.toLowerCase().includes(filterSubject.toLowerCase())
      );
    }

    // Sort by marks
    if (sortByMarks) {
      filteredItems.sort((a, b) => {
        const marksA = parseInt(a.marks.split("/")[0]);
        const marksB = parseInt(b.marks.split("/")[0]);
        return sortByMarks === "asc" ? marksA - marksB : marksB - marksA;
      });
    }

    // Sort by date
    if (sortByDate) {
      filteredItems.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortByDate === "asc" ? dateA - dateB : dateB - dateB;
      });
    }

    return filteredItems;
  };

  const toggleSortByMarks = () => {
    setSortByMarks((prev) => (prev === "asc" ? "desc" : "asc"));
    setSortByDate(null); // Reset other sort
  };

  const toggleSortByDate = () => {
    setSortByDate((prev) => (prev === "asc" ? "desc" : "asc"));
    setSortByMarks(null); // Reset other sort
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* First Div - Profile Form */}
      <div className="container mx-auto px-4 max-w-3xl mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-black">
          <h1 className="text-2xl font-bold text-black mb-6 text-center flex items-center justify-center">
            <FaUser className="mr-2" /> User Profile
          </h1>
          <div className="space-y-6">
            <div>
              <label className="block text-black mb-1 flex items-center">
                <FaUser className="text-black mr-2" />
                Name:
              </label>
              <input
                type="text"
                className="border border-black p-2 w-full rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-black mb-1 flex items-center">
                <FaEnvelope className="text-black mr-2" />
                Email:
              </label>
              <input
                type="email"
                className="border border-black p-2 w-full rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-black mb-1 flex items-center">
                <FaPhone className="text-black mr-2" />
                Phone No:
              </label>
              <input
                type="tel"
                className="border border-black p-2 w-full rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-black mb-1 flex items-center">
                <FaMapMarkerAlt className="text-black mr-2" />
                Address:
              </label>
              <input
                type="text"
                className="border border-black p-2 w-full rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-black mb-1 flex items-center">
                <FaGraduationCap className="text-black mr-2" />
                Class:
              </label>
              <input
                type="text"
                className="border border-black p-2 w-full rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Second Div - Items Section */}
      <ExamInfo
        items={getSortedAndFilteredItems()} // Pass the sorted and filtered items
        toggleSortByMarks={toggleSortByMarks}
        toggleSortByDate={toggleSortByDate}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        filterSubject={filterSubject}
        setFilterSubject={setFilterSubject}
        sortByMarks={sortByMarks}
        sortByDate={sortByDate}
        addItem={addItem} // Pass the addItem function
      />
    </div>
  );
};

export default Profile;
