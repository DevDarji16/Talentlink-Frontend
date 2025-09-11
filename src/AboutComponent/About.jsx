import { useContext } from "react";
import { Theme, UserData } from "../App";
import { Link } from "react-router-dom";

export default function About() {
  const theme = useContext(Theme);
  const userData = useContext(UserData);

  return (
    <div className={`relative overflow-x-hidden min-h-screen antialiased transition-colors duration-300 ${theme === "dark"
      ? "bg-neutral-950 text-neutral-100"
      : "bg-neutral-50 text-neutral-900"
      }`}
    >

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-myfont mb-3">
          About <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent font-myfont">talentlink</span>
        </h1>
        <p className={`text-lg max-w-2xl mx-auto mb-6 ${theme === "dark" ? "text-neutral-300" : "text-neutral-600"}`}>
          <span className="font-myfont font-extrabold pr-1">talentlink</span>is a modern freelance platform designed to help clients find skilled freelancers and manage projects efficiently. Built entirely by me, it focuses on a smooth, responsive, and secure user experience.
        </p>
      </section>

      {/* Developer Card */}
      <section className="flex justify-center px-4 sm:px-6 lg:px-8 mb-8">
        <div className={`flex flex-col items-center rounded-2xl shadow-md border p-6 max-w-md transition-all duration-300 ${theme === "dark"
          ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
          : "bg-white border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300"
          }`}
        >
          <img
            src="/myimage.jpg"
            alt="Developer"
            className="rounded-full w-24 h-24 object-cover mb-3 border-2 border-cyan-500"
          />
          <h2 className="text-xl font-bold mb-1">Dev Darji</h2>
          <h3 className="text-lg font-semibold mb-2 bg-gradient-to-tr from-emerald-400 to-indigo-600 text-transparent bg-clip-text">
            Full-Stack Developer
          </h3>
          <p className={`text-center text-sm ${theme === "dark" ? "text-neutral-300" : "text-neutral-600"}`}>
            I built  <span className="font-myfont font-extrabold ">talentlink</span> entirely on my own using <span className="font-medium">React</span> for the frontend and <span className="font-medium">Django + Django REST Framework</span> for the backend.
            The platform supports job postings, freelancer applications, messaging, and real-time collaboration features to ensure a seamless workflow for both clients and freelancers.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-3xl border p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 ${theme === "dark"
          ? "border-white/10 bg-gradient-to-r from-cyan-500/10 to-violet-600/10 hover:border-white/20"
          : "border-neutral-200 bg-gradient-to-r from-cyan-500/15 to-violet-600/15 hover:border-cyan-500/30"
          }`}
        >
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold">Explore  <span className="font-myfont font-extrabold pr-1">talentlink</span></h3>
            <p className={`mt-1 max-w-xl ${theme === "dark" ? "text-neutral-300" : "text-neutral-600"}`}>
              {userData?.authenticated
                ? "Jump back into your projects or discover new opportunities."
                : "Start connecting with top freelancers or find the perfect project today."}
            </p>
          </div>
          <div className="flex gap-2 md:gap-3">
            {userData?.authenticated ? (
              <Link to="/profile">
                <button className="cursor-hover px-4 py-2 md:px-5 md:py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-medium hover:opacity-90 transition-all duration-200">
                  Go to Dashboard
                </button>
              </Link>
            ) : (
              <Link to="/register">
                <button className="cursor-hover px-4 py-2 md:px-5 md:py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-medium hover:opacity-90 transition-all duration-200">
                  Get Started
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
