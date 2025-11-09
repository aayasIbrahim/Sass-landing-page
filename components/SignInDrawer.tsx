import React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
interface SignInDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  openSignUp: () => void; // function to open Sign Up drawer
}

const SignInDrawer: React.FC<SignInDrawerProps> = ({
  isOpen,
  onClose,
  openSignUp,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (res?.error) {
      alert(res.error);
    } else if (res?.ok) {
      // ✅ Role-based redirect after login
      const session = await fetch("/api/auth/session").then((r) => r.json());
      if (
        session?.user?.role === "admin" ||
        session?.user?.role === "super-admin"
      ) {
        router.push("/admin"); // admin dashboard
      } else {
        router.push("/"); // regular user home
      }
    }
  };
  return (
    <>
      {/* Drawer Panel */}
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
          className="absolute inset-0 bg-opacity-30 backdrop-blur-sm"
        />

        {/* Form Container */}
        <div className="relative w-full max-w-md bg-white shadow-xl rounded-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800">Sign In</h2>
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
              Email Address
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex flex-col text-sm font-medium text-gray-700">
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your Password"
                className="mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200"
            >
        {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up Prompt */}
          <p className="text-sm text-gray-600 mt-4 text-center">
            Don,t have an account?{" "}
            <button
              onClick={() => {
                onClose();
                openSignUp();
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignInDrawer;
