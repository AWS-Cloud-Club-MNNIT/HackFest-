import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { User, BookOpen, Users, CheckCircle2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
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
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.phone) {
        return setError("Please fill in all account details");
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 2) return;

    if (!formData.college || !formData.branch || !formData.year) {
      return setError("Please fill in all academic details");
    }

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
      localStorage.setItem("user", JSON.stringify(userData));

      if (userData?.role === "super_admin") {
        navigate("/super_admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 focus:bg-white/10 transition-all outline-none backdrop-blur-md";

  return (
    <div className="min-h-screen bg-[#05070f] text-white flex flex-col md:flex-row">
      
      {/* Left Banner Section (Unstop style side panel) */}
      <div className="hidden md:flex md:w-1/3 lg:w-[40%] bg-gradient-to-b from-[#1a1610] to-[#05070f] border-r border-white/5 p-12 flex-col relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[40%] bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="px-3 py-1 text-xs tracking-[0.25em] font-semibold text-[#d4af37] uppercase bg-[#d4af37]/10 rounded-full border border-[#d4af37]/20 shadow-[0_0_15px_rgba(212,175,55,0.15)] mb-6 inline-block">
              HackFest Registration
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#d4af37] to-[#e6c65c] mb-6 tracking-tight">
              Begin Your Journey
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Create an account to join the event, form your team, and participate in the ultimate challenge.
            </p>
          </motion.div>

          {/* Progress Steps Indicator */}
          <div className="mt-16 space-y-8">
            <div className={`flex items-center gap-4 transition-all ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step > 1 ? 'bg-[#d4af37] border-[#d4af37] text-black' : step === 1 ? 'border-[#d4af37] text-[#d4af37]' : 'border-gray-600 text-gray-600'}`}>
                {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : <User className="w-4 h-4" />}
              </div>
              <div>
                <p className="font-bold text-white">Account Details</p>
                <p className="text-sm text-gray-400">Basic information</p>
              </div>
            </div>

            <div className={`flex items-center gap-4 transition-all ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step === 2 ? 'border-[#d4af37] text-[#d4af37]' : 'border-gray-600 text-gray-600'}`}>
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Academic Profile</p>
                <p className="text-sm text-gray-400">College and skills</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 p-6 md:p-12 lg:p-20 flex flex-col justify-center relative">
        <div className="max-w-xl w-full mx-auto">
          
          <form onSubmit={handleSubmit} className="relative">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Account Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Account Details</h2>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">Full Name *</label>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className={inputStyles} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@university.edu" required className={inputStyles} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">Password *</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className={inputStyles} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">Phone *</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" required className={inputStyles} />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Academic Profile */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Academic Profile</h2>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">College *</label>
                    <input name="college" value={formData.college} onChange={handleChange} placeholder="Your University" required className={inputStyles} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">Branch *</label>
                    <input name="branch" value={formData.branch} onChange={handleChange} placeholder="e.g. Computer Science" required className={inputStyles} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">Year *</label>
                    <select name="year" value={formData.year} onChange={handleChange} required className={`${inputStyles} appearance-none [&>option]:bg-[#101522] [&>option]:text-white`}>
                      <option value="" disabled>Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">Skills (Comma separated)</label>
                    <input name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, UI/UX" className={inputStyles} />
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="px-6 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors">
                  Back
                </button>
              )}
              
              {step < 2 ? (
                <button type="button" onClick={nextStep} className="flex-1 bg-[#d4af37] text-black font-bold py-3 rounded-xl hover:bg-[#e6c65c] transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  Continue
                </button>
              ) : (
                <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-[#e6c65c] to-[#d4af37] text-black font-bold py-3 rounded-xl hover:from-[#f0d473] hover:to-[#e6c65c] transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? "Registering..." : "Complete Registration"}
                </button>
              )}
            </div>
            
          </form>

          <div className="text-center mt-8 text-sm text-gray-400">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-[#d4af37] font-semibold hover:text-white transition-colors">
              Log in here
            </button>
          </div>
          
        </div>
      </div>
      
    </div>
  );
};

export default Signup;