import { useContext, useState } from "react"
import { Theme, ThemeSet } from "../App"
import { Link } from "react-router-dom"
import { Moon, Sun, Send } from "lucide-react"

const Reviews = () => {
  const theme = useContext(Theme)
  const setTheme = useContext(ThemeSet)
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  })

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle review submission logic here
    // Reset form after submission
    setFormData({ name: "", message: "" })
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900"
      } relative overflow-hidden`}
    >
      {/* Background accents */}
      <div
        className={`absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl ${
          theme === "dark" ? "bg-pink-500/20" : "bg-pink-400/10"
        }`}
      ></div>
      <div
        className={`absolute -bottom-20 -right-20 w-72 h-72 rounded-full blur-3xl ${
          theme === "dark" ? "bg-purple-500/20" : "bg-purple-400/10"
        }`}
      ></div>

      {/* Brand title top-left */}
      <Link to={"/"}>
        <div
          className={`absolute top-6 left-8 font-myfont font-bold text-3xl ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
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
      <div
        className={`backdrop-blur-xl border rounded-2xl shadow-xl p-8 w-[400px] flex flex-col items-center space-y-6 transition-colors duration-300 ${
          theme === "dark" ? "bg-white/10 border-white/20" : "bg-white/80 border-gray-200"
        }`}
      >
        {/* Heading */}
        <h1 className="text-3xl p-0.5 font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Share Your Review
        </h1>

        {/* Subtext */}
        <p
          className={`text-center text-sm leading-relaxed max-w-sm ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Help others discover{" "}
          <span className={`font-semibold font-myfont ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            talentlink
          </span>{" "}
          by sharing your experience with our platform. <br />
          <span className={theme === "dark" ? "text-gray-400 italic" : "text-gray-500 italic"}>
            Your feedback matters to us.
          </span>
        </p>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Name Field */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={`w-full py-3 px-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                theme === "dark"
                  ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/15"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-gray-50"
              }`}
            />
          </div>

          {/* Message Field */}
          <div>
            <textarea
              name="message"
              placeholder="Share your thoughts about talentlink..."
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={4}
              className={`w-full py-3 px-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${
                theme === "dark"
                  ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/15"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-gray-50"
              }`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`flex items-center justify-center gap-3 w-full py-3 px-6 rounded-xl 
            font-medium shadow-lg transition-all duration-400 hover:cursor-pointer ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
            }`}
          >
            <Send className="w-4 h-4" />
            Submit Review
          </button>
        </form>

        {/* Extra motivation */}
        <p className={`text-xs text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          Thank you for taking the time to share your feedback.
        </p>
      </div>
    </div>
  )
}

export default Reviews
