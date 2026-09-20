import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  BookOpen, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Lock, 
  Building2, 
  GraduationCap, 
  Calendar, 
  Code2, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

// Reusable input wrapper component for consistent styling
const InputWrapper = ({ icon: Icon, label, children }) => (
  <div className="relative group">
    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-[#d4af37] transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#d4af37] transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      {children}
    </div>
  </div>
);

const Signup = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    year: "",
    skills: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
    // Clear error on typing
    if (error) setError("");
  };

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        return setError("Please fill in all personal details.");
      }
    } else if (step === 2) {
      if (!formData.college || !formData.branch || !formData.year) {
        return setError("Please fill in all academic details.");
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
    if (step !== 3) return;

    if (!formData.password) {
      return setError("Please enter a secure password.");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters long.");
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

      setUser(userData);

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const inputStyles = "w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#080b16]/60 border border-[#d4af37]/30 text-[#e8d7b5] placeholder-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 magic-input-focus outline-none backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-300";
  const selectStyles = `${inputStyles} appearance-none [&>option]:bg-[#10182b] [&>option]:text-[#e8d7b5]`;

  return (
    <div className="min-h-screen bg-[#05070f] text-white flex flex-col md:flex-row">
      
      {/* Left Banner Section */}
      <div className="hidden md:flex md:w-[40%] lg:w-[45%] bg-[#080b16] border-r border-[#d4af37]/20 p-12 lg:p-16 flex-col relative overflow-hidden justify-between">
        
        {/* Cinematic Background & Grid */}
        <div className="cinematic-bg-overlay z-0" />
        <div className="absolute inset-0 bg-hogwarts-grid opacity-20 pointer-events-none z-0" />
        
        {/* Ambient Magic Glows */}
        <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[60%] bg-[#d4af37]/15 rounded-full blur-[140px] pointer-events-none animate-candle z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[50%] bg-[#5c3b80]/20 rounded-full blur-[120px] pointer-events-none z-0" />
        
        {/* Floating Sparks */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4af37] rounded-full blur-[1px] animate-star z-0" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-[#f4e8c1] rounded-full blur-[2px] animate-float z-0" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-[#d4af37] rounded-full blur-[1px] animate-star z-0" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 flex flex-col h-full justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <span className="font-display px-4 py-1.5 text-xs tracking-[0.25em] font-bold text-[#d4af37] uppercase bg-[#d4af37]/10 rounded-full border border-[#d4af37]/30 shadow-[0_0_20px_rgba(212,175,55,0.15)] mb-8 inline-block">
              HACKFEST REGISTRATION
            </span>
            <h1 className="font-harry text-6xl lg:text-7xl font-bold text-[#f4e8c1] mb-6 tracking-wide drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] leading-tight">
              Begin Your<br/>Journey
            </h1>
            <p className="font-serif text-xl lg:text-2xl leading-relaxed text-[#e8d7b5]/80 max-w-md">
              Create an account to join the event, discover your house, and build something extraordinary.
            </p>
          </motion.div>

          {/* Vertical Progress Indicator */}
          <div className="mt-20 space-y-8 relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-800 rounded-full z-0">
              <motion.div 
                className="w-full bg-[#d4af37] rounded-full" 
                initial={{ height: "0%" }}
                animate={{ height: step === 1 ? "15%" : step === 2 ? "50%" : "100%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            <div className={`flex items-start gap-5 relative z-10 transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-500 bg-[#05070f] ${step > 1 ? 'border-[#d4af37] text-[#d4af37]' : step === 1 ? 'border-[#d4af37] text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border-gray-700 text-gray-600'}`}>
                {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-bold font-display">01</span>}
              </div>
              <div className="pt-1">
                <p className={`font-bold text-lg ${step >= 1 ? 'text-white' : 'text-gray-400'}`}>Personal Details</p>
                <p className="text-sm text-gray-500">How we can reach you</p>
              </div>
            </div>

            <div className={`flex items-start gap-5 relative z-10 transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-500 bg-[#05070f] ${step > 2 ? 'border-[#d4af37] text-[#d4af37]' : step === 2 ? 'border-[#d4af37] text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border-gray-700 text-gray-600'}`}>
                {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-bold font-display">02</span>}
              </div>
              <div className="pt-1">
                <p className={`font-bold text-lg ${step >= 2 ? 'text-white' : 'text-gray-400'}`}>Academic Profile</p>
                <p className="text-sm text-gray-500">Your background & skills</p>
              </div>
            </div>

            <div className={`flex items-start gap-5 relative z-10 transition-all duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-500 bg-[#05070f] ${step === 3 ? 'border-[#d4af37] text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border-gray-700 text-gray-600'}`}>
                <span className="font-bold font-display">03</span>
              </div>
              <div className="pt-1">
                <p className={`font-bold text-lg ${step >= 3 ? 'text-white' : 'text-gray-400'}`}>Account Setup</p>
                <p className="text-sm text-gray-500">Secure your profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 p-6 md:p-12 lg:p-20 flex flex-col justify-center relative overflow-y-auto bg-[#080b16] animate-magic-reveal">
        <div className="cinematic-bg-overlay z-0" />
        <div className="max-w-md w-full mx-auto z-10">
          
          {/* Mobile Progress Text */}
          <div className="md:hidden mb-10 text-center">
             <span className="font-display px-3 py-1 text-[10px] tracking-widest font-bold text-[#d4af37] uppercase bg-[#d4af37]/10 rounded-full border border-[#d4af37]/30 mb-4 inline-block shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              Step {step} of 3
            </span>
            <h2 className="font-harry text-3xl font-bold text-[#f4e8c1] mb-2 tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
              {step === 1 ? "Personal Details" : step === 2 ? "Academic Profile" : "Account Setup"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="relative parchment-card p-6 md:p-10 rounded-3xl">
            <AnimatePresence mode="wait" custom={step}>
              
              {/* STEP 1: Personal Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="hidden md:block mb-8">
                    <h2 className="font-harry text-4xl text-[#f4e8c1] mb-2 tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">Who are you?</h2>
                    <p className="text-[#e8d7b5]/60 font-serif">Let's start with your basic information.</p>
                  </div>
                  
                  <InputWrapper icon={User} label="Full Name *">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className={inputStyles} />
                  </InputWrapper>
                  
                  <InputWrapper icon={Mail} label="Email Address *">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@university.edu" required className={inputStyles} />
                  </InputWrapper>
                  
                  <InputWrapper icon={Phone} label="Phone Number *">
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" required className={inputStyles} />
                  </InputWrapper>
                </motion.div>
              )}

              {/* STEP 2: Academic Profile */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="hidden md:block mb-8">
                    <h2 className="font-harry text-4xl text-[#f4e8c1] mb-2 tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">Your Background</h2>
                    <p className="text-[#e8d7b5]/60 font-serif">Tell us about your studies and skills.</p>
                  </div>
                  
                  <InputWrapper icon={Building2} label="College / University *">
                    <input name="college" value={formData.college} onChange={handleChange} placeholder="Institute of Technology" required className={inputStyles} />
                  </InputWrapper>
                  
                  <InputWrapper icon={GraduationCap} label="Branch / Department *">
                    <input name="branch" value={formData.branch} onChange={handleChange} placeholder="Computer Science" required className={inputStyles} />
                  </InputWrapper>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <InputWrapper icon={Calendar} label="Year of Study *">
                      <select name="year" value={formData.year} onChange={handleChange} required className={selectStyles}>
                        <option value="" disabled>Select</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="5">5th+ Year</option>
                      </select>
                    </InputWrapper>
                    <div className="flex flex-col justify-end">
                      {/* Empty space or additional small field if needed */}
                    </div>
                  </div>

                  <InputWrapper icon={Code2} label="Skills (Comma separated)">
                    <input name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Design" className={inputStyles} />
                  </InputWrapper>
                </motion.div>
              )}

              {/* STEP 3: Account Setup */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="hidden md:block mb-8">
                    <h2 className="font-harry text-4xl text-[#f4e8c1] mb-2 tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">Secure Account</h2>
                    <p className="text-[#e8d7b5]/60 font-serif">Set a password to complete registration.</p>
                  </div>
                  
                  <InputWrapper icon={Lock} label="Password *">
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className={inputStyles} />
                  </InputWrapper>
                  
                  <div className="bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-xl p-4 flex gap-3 mt-4">
                    <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0" />
                    <p className="text-xs text-gray-400 leading-relaxed">
                      By completing registration, you agree to the HackFest Terms of Service and Privacy Policy. You will be able to create or join a team after confirming your account.
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Error Message with Shake Animation */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-10 pt-8 border-t border-white/5">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep} 
                  className="px-6 py-4 rounded-xl bg-[#080b16] border border-[#d4af37]/30 text-[#e8d7b5] font-bold hover:bg-[#d4af37]/10 hover:border-[#d4af37]/60 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button 
                  type="button" 
                  onClick={nextStep} 
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#24170f] via-[#5c3b80]/40 to-[#24170f] text-[#d4af37] border border-[#d4af37]/50 font-bold py-4 rounded-xl hover:text-[#f4e8c1] hover:border-[#f4e8c1] transition-colors shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 relative group overflow-hidden bg-gradient-to-r from-[#e6c65c] to-[#d4af37] text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </span>
                </button>
              )}
            </div>
            
          </form>

          <div className="text-center mt-8 text-sm text-gray-500">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-[#d4af37] font-bold hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#d4af37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left pb-0.5">
              Log in here
            </button>
          </div>
          
        </div>
      </div>
      
    </div>
  );
};

export default Signup;