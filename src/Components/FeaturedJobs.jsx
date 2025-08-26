import React, { useEffect, useState, useContext } from "react";
import { apiClient } from "../apiClient";
import { UserData } from "../App";
import { Link } from "react-router-dom";

const FeaturedJobs = ({ theme }) => {
    const [jobs, setJobs] = useState([]);
    const userData = useContext(UserData)

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // const data = await apiClient("http://localhost:8000/jobs/", "GET");
                const data = await apiClient("https://talentlink-nloa.onrender.com/jobs/", "GET");
                setJobs(data);
                console.log(data)
            } catch (err) {
                console.error("Error fetching jobs:", err);
            }
        };
        fetchJobs();
    }, []);

    return (
        <section className="py-16 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <h2 className="text-3xl font-myfont font-bold mb-8 text-center">
                    Featured{" "}
                    <span className="bg-gradient-to-r  from-pink-300 to-purple-600 bg-clip-text  text-transparent">
                        jobs
                    </span>
                </h2>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {jobs.slice(0, 4).map((job) => (
                        <article
                            key={job.id}
                            className={`rounded-2xl border p-5 transition-all duration-300 transform hover:scale-105 ${theme === "dark"
                                    ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md"
                                }`}
                        >
                            {/* Client Info */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={job.client?.profilepic}
                                    alt={job.client?.fullname}
                                    className="w-12 h-12 rounded-full object-cover border"
                                />
                                <div>
                                    <h3 className="font-medium">{job.client?.fullname}</h3>
                                    <h3 className="font-medium text-gray-500 text-sm">{job?.client?.username}</h3>
                                    <p
                                        className={`text-sm ${theme === "dark"
                                                ? "text-neutral-300"
                                                : "text-neutral-600"
                                            }`}
                                    >
                                        {job.category}
                                    </p>
                                </div>
                            </div>

                            {/* Job Info */}
                            <div className="mt-3">
                                <h4 className="font-semibold">{job.title}</h4>
                                <p className="text-sm opacity-70 line-clamp-1">
                                    {job.description}
                                </p>
                            </div>

                            {/* Budget */}
                            <div className="flex items-center gap-1 mt-3">
                                <span className="text-sm font-medium">
                                    Budget: ${job.budget}
                                </span>
                            </div>

                            {/* Tags */}
                            <div className="mt-3 flex flex-wrap gap-2">
                                {job.tags?.map((tag, i) => (
                                    <span
                                        key={i}
                                        className={`text-xs px-2 py-1 rounded-lg border ${theme === "dark"
                                                ? "border-white/10 bg-white/5"
                                                : "border-neutral-200 bg-neutral-100"
                                            }`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <Link to={
                                userData?.authenticated
                                    ? `/freelancer/${job?.client?.username}`
                                    : "/register"
                            }
                            >
                                <button
                                    className={`mt-4 w-full px-4 py-2 rounded-xl border transition-all duration-200 ${theme === "dark"
                                            ? "border-white/10 hover:border-white/20 hover:bg-white/5"
                                            : "border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100"
                                        }`}
                                >
                                    {userData?.authenticated ? "View Profile" : "Register to View"}
                                </button></Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedJobs;
