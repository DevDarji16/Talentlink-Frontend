import React, { useContext, useRef } from "react";
import { Role, SetRole, Theme, ThemeSet } from "../App";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

const Register = () => {
  const role = useContext(Role);
  const setRole = useContext(SetRole);
  const btnRef = useRef(null);
  const theme = useContext(Theme);
  const setTheme = useContext(ThemeSet);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleSignUp = () => {
    localStorage.setItem("selected_role", role);
    // window.location.href = "https://talentlink-nloa.onrender.com/auth/accounts/google/login";
    window.location.href = "http://localhost:8000/auth/accounts/google/login";
  };

  // Hover direction effect
  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < rect.width / 2) {
      btn.style.setProperty("--hover-x", "0%");
    } else {
      btn.style.setProperty("--hover-x", "100%");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      theme === "dark" 
        ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white" 
        : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900"
    } relative overflow-hidden`}>
      {/* Background accents */}
      <div className={`absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl ${
        theme === "dark" 
          ? "bg-pink-500/20" 
          : "bg-pink-400/10"
      }`}></div>
      <div className={`absolute -bottom-20 -right-20 w-72 h-72 rounded-full blur-3xl ${
        theme === "dark" 
          ? "bg-purple-500/20" 
          : "bg-purple-400/10"
      }`}></div>

      {/* Brand title top-left */}
      <Link to={"/"}>
        <div className={`absolute top-6 left-8 font-myfont font-bold text-3xl ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}>
          talentlink
        </div>
      </Link>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-8 p-2 rounded-full cursor-hover transition-all duration-200 ${
          theme === "dark"
            ? "bg-white/10 hover:bg-white/20 text-yellow-300"
            : "bg-neutral-200 hover:bg-neutral-300 text-amber-500"
        }`}
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Card */}
      <div className={`backdrop-blur-xl border rounded-2xl shadow-xl p-8 w-[400px] flex flex-col items-center space-y-6 transition-colors duration-300 ${
        theme === "dark" 
          ? "bg-white/10 border-white/20" 
          : "bg-white/80 border-gray-200"
      }`}>
        {/* Heading */}
        <h1 className="text-3xl p-0.5 font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Create your account
        </h1>

        {/* Subtext */}
        <p className={`text-center text-sm leading-relaxed max-w-sm ${
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        }`}>
          Join <span className={`font-semibold font-myfont ${theme === "dark" ? "text-white" : "text-gray-900"}`}>talentlink</span> and
          connect with top clients & freelancers worldwide. <br />
          <span className={theme === "dark" ? "text-gray-400 italic" : "text-gray-500 italic"}>
            Your next big opportunity starts here.
          </span>
        </p>

        {/* Google Sign Up with direction-aware hover */}
        <button
          ref={btnRef}
          onClick={handleSignUp}
          onMouseMove={handleMouseMove}
          className={`relative overflow-hidden flex items-center justify-center gap-3 w-full py-3 px-6 rounded-xl 
          font-medium shadow-lg transition-all duration-400 hover:cursor-pointer ${
            theme === "dark" 
              ? "bg-transparent text-white border border-white/20 hover:bg-gray-200 hover:text-black" 
              : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-800 hover:text-orange-100"
          }`}
        >
          <span className="relative z-10 flex items-center gap-3">
            <FcGoogle className="text-2xl" />
            Sign up with Google
          </span>

        </button>

        {/* Extra motivation */}
        <p className={`text-xs text-center ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}>
          Fast, free, and secure — it only takes a click.
        </p>
      </div>
    </div>
  );
};

export default Register;