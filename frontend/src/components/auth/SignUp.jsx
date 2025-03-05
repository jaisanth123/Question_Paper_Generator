import React, { useState } from "react";
import { FaUser, FaLock, FaPhone, FaEnvelope } from "react-icons/fa"; // Import additional icons
import { Link } from "react-router-dom"; // Import Link for navigation

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // State for email
  const [mobile, setMobile] = useState(""); // State for mobile number
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here (e.g., API call)
    console.log("User signed up:", { username, password, email, mobile });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-8 rounded-lg shadow-lg w-96" // Increased padding and width
      >
        <h2 className="text-2xl font-bold mb-4 text-white text-center bg-black p-3 rounded-t">
          {" "}
          {/* Increased text size and padding */}
          Sign Up
        </h2>
        {error && <p className="text-red-500">{error}</p>}

        <div className="mb-4">
          <label className="block text-black mb-2">Username</label>
          <div className="flex items-center border border-black bg-gray-200 p-2 rounded">
            <FaUser className="mr-2 text-black" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent border-none w-full text-black"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-black mb-2">Email</label>
          <div className="flex items-center border border-black bg-gray-200 p-2 rounded">
            <FaEnvelope className="mr-2 text-black" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none w-full text-black"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-black mb-2">Mobile No</label>
          <div className="flex items-center border border-black bg-gray-200 p-2 rounded">
            <FaPhone className="mr-2 text-black" />
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="bg-transparent border-none w-full text-black"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-black mb-2">Password</label>
          <div className="flex items-center border border-black bg-gray-200 p-2 rounded">
            <FaLock className="mr-2 text-black" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-none w-full text-black"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-black text-white p-3 rounded w-full hover:bg-gray-800 transition" // Increased button padding
        >
          Sign Up
        </button>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/signin" className="text-black hover:underline">
            <b>
              <u>Log in</u>
            </b>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
