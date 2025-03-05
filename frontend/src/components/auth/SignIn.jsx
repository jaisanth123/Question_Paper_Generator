// frontend/src/components/SignIn.jsx
import React, { useState } from "react";

const SignIn = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hardcoded credentials
    if (username === "jai" && password === "1234") {
      // Create a simple JWT token (for demonstration purposes)
      const token = btoa(
        JSON.stringify({ username, exp: Date.now() + 3600000 })
      ); // Expires in 1 hour
      sessionStorage.setItem("jwtToken", token); // Store token in session storage
      onLogin(); // Call the onLogin function passed as a prop
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-white">Sign In</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-300">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-600 bg-gray-700 p-2 w-full rounded text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-600 bg-gray-700 p-2 w-full rounded text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default SignIn;
