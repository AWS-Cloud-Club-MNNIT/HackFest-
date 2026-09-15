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
        navigate("/super-admin");
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
    <div className="min-h-screen bg-[#080b16] text-[#e8d7b5] flex items-center justify-center px-4 relative overflow-hidden animate-magic-reveal">

      {/* Cinematic Background & Grid */}
      <div className="cinematic-bg-overlay z-0" />
      <div className="absolute inset-0 bg-hogwarts-grid opacity-20 pointer-events-none z-0" />
      
      {/* Floating Sparks */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4af37] rounded-full blur-[1px] animate-star z-0" />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-[#f4e8c1] rounded-full blur-[2px] animate-float z-0" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-[#d4af37] rounded-full blur-[1px] animate-star z-0" style={{ animationDelay: '2s' }} />

      <div className="relative w-full max-w-md z-10">

        {/* Heading */}
        <div className="text-center mb-8">
          <p className="font-display font-bold text-[#d4af37] tracking-[0.35em] text-xs sm:text-sm uppercase mb-2 shadow-[0_0_15px_rgba(212,175,55,0.2)] inline-block px-3 py-1 bg-[#d4af37]/10 rounded-full border border-[#d4af37]/30">
            HACKFEST 1.0
          </p>

          <h1 className="font-harry text-5xl sm:text-6xl font-bold text-[#f4e8c1] tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)] mt-4">
            Welcome Back
          </h1>

          <p className="font-serif text-base sm:text-lg text-[#e8d7b5]/70 mt-2">
            Enter the magical world of innovation
          </p>
        </div>

        {/* Login Card */}
        <div className="parchment-card p-8 md:p-10 rounded-3xl">

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 transition-colors">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="wizard@example.com"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-[#080b16]/60 border border-[#d4af37]/30 text-[#e8d7b5] placeholder-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 magic-input-focus outline-none backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 transition-colors">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-[#080b16]/60 border border-[#d4af37]/30 text-[#e8d7b5] placeholder-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 magic-input-focus outline-none backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-300"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl flex items-start gap-3">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#24170f] via-[#5c3b80]/40 to-[#24170f] text-[#d4af37] border border-[#d4af37]/50 font-bold py-4 rounded-xl hover:text-[#f4e8c1] hover:border-[#f4e8c1] transition-colors shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-70 mt-2"
            >
              {loading ? "Entering..." : "Enter HackFest"}
            </button>

          </form>

          <div className="text-center mt-8 text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#d4af37] font-bold hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#d4af37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left pb-0.5"
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