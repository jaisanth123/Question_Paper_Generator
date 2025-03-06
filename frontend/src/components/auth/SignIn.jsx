import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const SignIn = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "jai" && password === "1234") {
      const token = btoa(
        JSON.stringify({ username, exp: Date.now() + 3600000 })
      );
      sessionStorage.setItem("jwtToken", token);
      onLogin();
      navigate("/"); // Redirect to home page after login
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-white text-center bg-black p-3 rounded-t">
          Sign In
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
          className="bg-black text-white p-3 rounded w-full hover:bg-gray-800 transition"
        >
          Login
        </button>
        <p className="mt-4 text-center">
          New to the site?{" "}
          <Link to="/signup" className="text-black hover:underline">
            <b>
              <u>Sign up</u>
            </b>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
