import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    college: "",
    branch: "",
    year: "",
    skills: "",
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
      const data = {
        ...formData,
        year: Number(formData.year),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const response = await API.post("/auth/signup", data);
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
        error.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b16] text-white flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_45%)]" />

      <div className="relative w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[#d4af37] tracking-[0.35em] text-sm uppercase mb-3">
            HackFest 1.0
          </p>

          <h1 className="text-4xl font-bold text-[#d4af37]">
            Join the Wizards
          </h1>

          <p className="text-gray-400 mt-3">
            Create your account and find your team
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#101522]/90 border border-[#d4af37]/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(212,175,55,0.08)] backdrop-blur-xl">

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            {/* Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Full Name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none"
              />
            </div>

            {/* Email */}
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
                className="w-full px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Phone
              </label>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none"
              />
            </div>

            {/* College */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                College
              </label>

              <input
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="College / University"
                className="w-full px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Branch
              </label>

              <input
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="e.g. ECE, CSE"
                className="w-full px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Year
              </label>

              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 text-gray-300 focus:border-[#d4af37] outline-none"
              >
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Skills
              </label>

              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Python, AI/ML"
                className="w-full px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="md:col-span-2 text-red-400 text-sm text-center">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 w-full py-3 rounded-lg bg-[#d4af37] text-black font-semibold hover:bg-[#e6c65c] transition disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Begin Your Journey"}
            </button>

          </form>

          <div className="text-center mt-6 text-sm text-gray-400">
            Already have an account?{" "}

            <button
              onClick={() => navigate("/login")}
              className="text-[#d4af37] hover:underline"
            >
              Login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;