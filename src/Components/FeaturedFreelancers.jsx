import { useContext, useEffect, useState } from "react";
import { Star } from "lucide-react";
import { UserData } from "../App";
import { Link } from "react-router-dom";
import { apiClient } from "../apiClient";

export default function FeaturedFreelancers({ theme }) {
    const [featured, setFeatured] = useState([]);
    const userData = useContext(UserData)

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                // const res = await fetch("https://talentlink-nloa.onrender.com/gigs/");
                // const res = await fetch("http://localhost:8000/gigs/");
                const data = await apiClient("/gigs/", "GET");
                // const data = await res.json();
             
                setFeatured(data); // directly set gigs as featured
            } catch (err) {
                console.error("Error fetching gigs:", err);
            }
        };
        fetchGigs();
    }, []);

    return (
        <section
            id="featured"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14"
        >
            <div className="flex items-end  justify-center mb-6">
                <h2 className="text-3xl font-myfont font-bold mb-8 text-center">
                    Featured{" "}
                    <span className="bg-gradient-to-r  from-pink-300 to-purple-600 bg-clip-text  text-transparent">
                        gigs
                    </span>
                </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 justify-center justify-items-center">

                {featured.slice(0, 4).map((gig) => (
                    <article
                        key={gig.id}
                        className={`rounded-2xl border p-5 transition-all duration-300 transform hover:scale-105 ${theme === "dark"
                                ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md"
                            }`}
                    >
                        {/* Freelancer Info */}
                        <div className="flex items-center gap-3">
                            <img
                                src={gig.freelancer.profilepic}
                                alt={gig.freelancer.fullname}
                                className="w-12 h-12 rounded-full object-cover border"
                            />
                            <div>
                                <h3 className="font-medium">{gig.freelancer.fullname}</h3>
                                <h3 className="font-medium text-sm text-gray-500">{gig.freelancer.username}</h3>
                                <p
                                    className={`text-sm ${theme === "dark" ? "text-neutral-300" : "text-neutral-600"
                                        }`}
                                >
                                    {gig.freelancer.role}
                                </p>
                            </div>
                        </div>

                        {/* Gig Info */}
                        <div className="mt-3">
                            <h4 className="font-semibold text-lg">{gig.title}</h4>
                            <p
                                className={`text-sm mt-1 line-clamp-1 ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                                    }`}
                            >
                                {gig.description}
                            </p>
                        </div>

                        {/* Price & Tags */}
                        <div className="flex items-center gap-1 mt-3">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">5.0</span>
                            <span
                                className={`mx-2 ${theme === "dark" ? "text-neutral-500" : "text-neutral-400"
                                    }`}
                            >
                                •
                            </span>
                            <span className="text-sm">${gig.price}</span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {gig.tags.map((t, i) => (
                                <span
                                    key={i}
                                    className={`text-xs px-2 py-1 rounded-lg border ${theme === "dark"
                                            ? "border-white/10 bg-white/5"
                                            : "border-neutral-200 bg-neutral-100"
                                        }`}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>



                        <Link to={
                                userData?.authenticated
                                    ? `/freelancer/${gig?.freelancer?.username}`
                                    : "/register"
                            }
                        >
                            <button
                                className={`mt-4 w-full cursor-hover px-4 py-2 rounded-xl border transition-all duration-200 ${theme === "dark"
                                        ? "border-white/10 hover:border-white/20 hover:bg-white/5"
                                        : "border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100"
                                    }`}
                            >
                                {userData?.authenticated ? "View Profile" : "Register to View"}
                            </button>
                        </Link>

                    </article>
                ))}
            </div>
        </section>
    );
}
