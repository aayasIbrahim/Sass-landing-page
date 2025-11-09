import React from "react";
import { useState } from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpDrawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        console.log("User signed up successfully! and please login.");
        // redirect after success
      } else {
        const data = await res.json();
        setError(data.message || "Sign-up failed");
      }
    } catch  {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Drawer Wrapper */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          onClick={onClose}
          className="absolute inset-0  bg-opacity-30 backdrop-blur-sm"
        />

        {/* Form Container */}
        <div className="relative w-full max-w-md bg-white shadow-xl rounded-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800">Sign Up</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col text-sm font-medium text-gray-700">
              Full Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex flex-col text-sm font-medium text-gray-700">
              Email Address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex flex-col text-sm font-medium text-gray-700">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpDrawer;
