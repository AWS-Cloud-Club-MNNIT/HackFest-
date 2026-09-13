import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", formData);
      const userData = response.data.user;
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      if (userData?.role === "super_admin") {
        navigate("/super_admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b16] text-white flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_45%)]" />

      <div className="relative w-full max-w-md">

        {/* Heading */}
        <div className="text-center mb-8">
          <p className="text-[#d4af37] tracking-[0.35em] text-sm uppercase mb-3">
            HackFest 1.0
          </p>

          <h1 className="text-4xl font-bold text-[#d4af37]">
            Welcome Back
          </h1>

          <p className="text-gray-400 mt-3">
            Enter the magical world of innovation
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#101522]/90 border border-[#d4af37]/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(212,175,55,0.08)] backdrop-blur-xl">

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="wizard@example.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none transition"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#d4af37] text-black font-semibold hover:bg-[#e6c65c] transition disabled:opacity-60"
            >
              {loading ? "Entering..." : "Enter HackFest"}
            </button>

          </form>

          <div className="text-center mt-6 text-sm text-gray-400">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#d4af37] hover:underline"
            >
              Create Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;