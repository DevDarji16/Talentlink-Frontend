

import { useContext, useEffect, useRef, useState } from "react"
import { ChevronRight, Search, Rocket, Users, Briefcase, MessageSquare, Star, ArrowRight, Moon, Sun } from "lucide-react"
import { Link } from "react-router-dom";
import FeaturedFreelancers from "./FeaturedFreelancers";
import FeaturedJobs from "./FeaturedJobs";
import { Theme, ThemeSet, UserData } from "../App";

export default function TalentLinkHome() {
  const theme = useContext(Theme)
  const setTheme = useContext(ThemeSet)
  const userData = useContext(UserData)
  // const [theme, setTheme] = useState("dark") // Default to dark theme
  const heroRef = useRef(null)
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    // Save theme preference to localStorage
    localStorage.setItem("theme", newTheme)
  }

  // Apply theme on component mount and when theme changes
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Check for system preference
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(systemPrefersDark ? "dark" : "light")
    }
  }, [])

  useEffect(() => {
    // Apply theme class to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  useEffect(() => {
    // --- Enhanced Smooth Custom Cursor ---
    const cursor = cursorRef.current
    const dot = cursorDotRef.current

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0
    let dotX = 0
    let dotY = 0

    // Smooth cursor following with different speeds for layered effect
    function updateCursor() {
      // Smooth interpolation for cursor ring (slower)
      cursorX += (mouseX - cursorX) * 0.1
      cursorY += (mouseY - cursorY) * 0.1

      // Faster interpolation for dot (more responsive)
      dotX += (mouseX - dotX) * 0.25
      dotY += (mouseY - dotY) * 0.25

      if (cursor) {
        cursor.style.transform = `translate3d(${cursorX - 16}px, ${cursorY - 16}px, 0)`
      }
      if (dot) {
        dot.style.transform = `translate3d(${dotX - 2}px, ${dotY - 2}px, 0)`
      }

      requestAnimationFrame(updateCursor)
    }

    function handleMouseMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Start the animation loop
    updateCursor()
    window.addEventListener("mousemove", handleMouseMove)

    // Enhanced hover effects for cursor-hover elements
    const hovers = document.querySelectorAll(".cursor-hover")
    hovers.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (cursor) {
          cursor.style.transform += " scale(1.5)"
          cursor.style.borderColor = theme === "dark"
            ? "rgba(34, 211, 238, 0.8)"
            : "rgba(14, 165, 233, 0.8)"
          cursor.style.backgroundColor = theme === "dark"
            ? "rgba(34, 211, 238, 0.1)"
            : "rgba(14, 165, 233, 0.1)"
        }
      })
      el.addEventListener("mouseleave", () => {
        if (cursor) {
          cursor.style.transform = cursor.style.transform.replace(" scale(1.5)", "")
          cursor.style.borderColor = theme === "dark"
            ? "rgba(255, 255, 255, 0.5)"
            : "rgba(0, 0, 0, 0.3)"
          cursor.style.backgroundColor = "transparent"
        }
      })
    })

    // Navbar shadow on scroll
    const handleScroll = () => {
      const navbar = document.getElementById("navbar")
      if (window.scrollY > 10) {
        navbar?.classList.add("shadow-lg", theme === "dark" ? "shadow-black/30" : "shadow-gray-200")
      } else {
        navbar?.classList.remove("shadow-lg", theme === "dark" ? "shadow-black/30" : "shadow-gray-200")
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [theme])





  const testimonials = [
    {
      quote: "We filled a niche role in 48 hours. TalentLink just… works.",
      name: "Ananya S.",
      title: "Hiring Manager, Zense",
    },
    { quote: "Got my first 5 clients in a week. Smooth onboarding.", name: "Karthik R.", title: "Freelancer" },
    { quote: "A clean, no-noise alternative to bulky marketplaces.", name: "Meera T.", title: "Founder, FinEdge" },
  ]

  return (
    <div className={`relative cursor-none overflow-x-hidden min-h-screen antialiased transition-colors duration-300 ${theme === "dark"
      ? "bg-neutral-950 text-neutral-100"
      : "bg-neutral-50 text-neutral-900"
      }`}>
      {/* Enhanced Smooth Custom Cursor */}
      <div
        ref={cursorRef}
        className={`fixed sm:flex hidden z-[100] pointer-events-none w-8 h-8 rounded-full border  transition-all duration-200 ease-out ${theme === "dark"
          ? "border-white"
          : "border-black"
          }`}
        style={{ left: 0, top: 0 }}
      />
      <div
        ref={cursorDotRef}
        className={`fixed sm:flex hidden z-[101] pointer-events-none w-1 mix-blend-difference h-1 p-[3px] rounded-full  ${theme === "dark" ? "bg-red-700" : "bg-red-700"
          }`}
        style={{ left: 0, top: 0 }}
      />

      {/* Background gradient + blobs */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute -top-40 -left-40 w-[50rem] h-[50rem] rounded-full blur-[120px] animate-pulse ${theme === "dark"
          ? "opacity-25 bg-gradient-to-br from-cyan-500 to-violet-600"
          : "opacity-15 bg-gradient-to-br from-cyan-400 to-violet-500"
          }`} />
        <div
          className={`absolute top-1/2 -right-40 w-[45rem] h-[45rem] rounded-full blur-[120px] animate-pulse ${theme === "dark"
            ? "opacity-20 bg-gradient-to-tr from-fuchsia-500 to-blue-500"
            : "opacity-15 bg-gradient-to-tr from-fuchsia-400 to-blue-400"
            }`}
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Navbar */}
      <header
        id="navbar"
        className={`sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:transition-colors duration-300 ${theme === "dark"
          ? "supports-[backdrop-filter]:bg-neutral-950/60 border-b border-white/5"
          : "supports-[backdrop-filter]:bg-white/80 border-b border-neutral-200/50"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-semibold tracking-tight font-myfont">talentlink</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full cursor-hover transition-all duration-200 ${theme === "dark"
                ? "bg-white/10 hover:bg-white/20 text-yellow-300"
                : "bg-neutral-200 hover:bg-neutral-300 text-amber-500"
                }`}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>


            {userData?.authenticated ? (
              <Link to="/profile">
                <img
                  src={userData?.details?.profilepic || "/placeholder.svg"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-cyan-500 hover:opacity-90 transition-all duration-200"
                />
              </Link>
            ) : (
              <Link to="/register">
                <button className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:opacity-90 cursor-hover flex items-center gap-1 transition-all duration-200 text-white">
                  Get Started <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            )}

          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-20 text-center"
      >
        <p
          className={`text-xs uppercase tracking-[0.2em] mb-4 animate-fade-in ${theme === "dark" ? "text-cyan-300/90" : "text-cyan-600"
            }`}
        >
          FREELANCERS • CLIENTS • PROJECTS
        </p>

        <h1 className="text-4xl md:text-6xl font-semibold leading-tight animate-fade-in-up">
          Connecting{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
            <span className="font-myfont">top talent</span>
          </span>{" "}
          with the Right Opportunities
        </h1>

        <p
          className={`mt-4 md:mt-6 max-w-2xl mx-auto animate-fade-in-up ${theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          style={{ animationDelay: "0.2s" }}
        >
          Hire the best freelancers or land your next big project. Verified reviews, clean workflows.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={userData?.authenticated?'/discover':'/register'}
            className="cursor-hover inline-flex items-center justify-center rounded-xl px-5 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-medium hover:opacity-90 transition-all duration-200"
          >
            Find{" "}
            <span className="flex items-center ml-1 pt-[4.5px] font-myfont">talent</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>

          <Link to={userData?.authenticated?'/jobs':'/register'}
            
            className={`cursor-hover hover:bg-gray-100 hover:text-gray-900 inline-flex items-center justify-center rounded-xl px-5 py-3 border transition-all duration-200 ${theme === "dark"
              ? "border-white/15 bg-white/5"
              : "border-neutral-300 bg-white"
              }`}
          >
            Find{" "}
            <span className="flex items-center ml-1 pt-[4.5px] font-myfont">work</span>
          </Link>
        </div>
      </section>




      <FeaturedFreelancers id="talent" theme={theme} />
      <FeaturedJobs theme={theme} />

      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <h2 className="text-3xl font-myfont font-bold mb-8 text-center">
          How{" "}
          <span className="bg-gradient-to-r from-green-300 to-blue-600 bg-clip-text text-transparent">
            talentlink works
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "1", title: "Sign Up & Setup", desc: "Create your client or freelancer profile to get started." },
            { step: "2", title: "Post or Discover Jobs", desc: "Clients post projects, freelancers explore job listings." },
            { step: "3", title: "Apply & Connect", desc: "Freelancers apply, clients review and connect instantly." },
            { step: "4", title: "Work & Payments", desc: "Collaborate on projects and handle payments securely." },
          ].map((s, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-5 transition-all duration-300 transform hover:scale-105 ${theme === "dark"
                ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md"
                }`}
            >
              <div className={`font-myfont text-sm tracking-[0.09em] ${theme === "dark" ? "text-cyan-300/90" : "text-cyan-600"}`}>
                Step {s.step}
              </div>
              <div className="font-medium mt-1">{s.title}</div>
              <p className={`text-sm mt-2 ${theme === "dark" ? "text-neutral-300" : "text-neutral-600"}`}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* Testimonials */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Loved by <span className=" ml-1 pt-[4.5px] font-myfont">teams & independents</span> </h2>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-6 transition-all duration-300 transform hover:scale-105 ${theme === "dark"
                ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md"
                }`}
            >
              <p className={theme === "dark" ? "text-neutral-200" : "text-neutral-700"}>"{t.quote}"</p>
              <div className={`mt-4 text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                }`}>
                — {t.name}, {t.title}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className={`rounded-3xl border p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 ${theme === "dark"
            ? "border-white/10 bg-gradient-to-r from-cyan-500/10 to-violet-600/10 hover:border-white/20"
            : "border-neutral-200 bg-gradient-to-r from-cyan-500/15 to-violet-600/15 hover:border-cyan-500/30"
          }`}>
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold">
              {userData?.authenticated
                ? `Welcome back, ${userData.details?.fullname || userData.username}!`
                : "Join talentlink today"}
            </h3>
            <p className={`mt-2 max-w-xl ${theme === "dark" ? "text-neutral-300" : "text-neutral-600"
              }`}>
              {userData?.authenticated
                ? "Jump right back into your projects or discover new opportunities."
                : "Grow your career or business with a platform that keeps things fast, fair, and focused."}
            </p>
          </div>
          <div className="flex gap-3">
            {userData?.authenticated ? (
              <Link to="/profile">
                <button className="cursor-hover px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-medium hover:opacity-90 transition-all duration-200">
                  Go to Dashboard
                </button>
              </Link>
            ) : (
              <Link to="/register">
                <button className="cursor-hover px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-medium hover:opacity-90 transition-all duration-200">
                  Get Started
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className={`border-t ${theme === "dark" ? "border-white/10" : "border-neutral-200"
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-myfont text-2xl">talentlink</span>
            </div>
            <p className={theme === "dark" ? "text-neutral-400" : "text-neutral-500"}>
              A cleaner way to hire and get hired.
            </p>
          </div>
          <div>
            <div className="font-medium mb-2">Product</div>
            <ul className={`space-y-1 ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"
              }`}>
              <li>
                <a className={`hover:${theme === "dark" ? "text-neutral-200" : "text-neutral-800"
                  } cursor-hover transition-colors duration-200`} href="#">
                  Find Talent
                </a>
              </li>
              <li>
                <a className={`hover:${theme === "dark" ? "text-neutral-200" : "text-neutral-800"
                  } cursor-hover transition-colors duration-200`} href="#">
                  Find Work
                </a>
              </li>

            </ul>
          </div>
          <div>
            <div className="font-medium mb-2">Company</div>
            <ul className={`space-y-1 ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"
              }`}>
              <li>
                <a className={`hover:${theme === "dark" ? "text-neutral-200" : "text-neutral-800"
                  } cursor-hover transition-colors duration-200`} href="#">
                  About
                </a>
              </li>

            </ul>
          </div>
          <div>
            <div className="font-medium mb-2">Support</div>
            <ul className={`space-y-1 ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"
              }`}>

              <li>
                <a className={`hover:${theme === "dark" ? "text-neutral-200" : "text-neutral-800"
                  } cursor-hover transition-colors duration-200`} href="#">
                  Terms
                </a>
              </li>
              <li>
                <a className={`hover:${theme === "dark" ? "text-neutral-200" : "text-neutral-800"
                  } cursor-hover transition-colors duration-200`} href="#">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className={`text-xs text-center pb-8 ${theme === "dark" ? "text-neutral-500" : "text-neutral-400"
          }`}>
          © {new Date().getFullYear()} <span className="font-myfont ">talentlink</span>. All rights reserved.
        </div>
      </footer>
    </div>
  )
}