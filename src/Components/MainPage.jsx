import { useEffect, useState } from "react"
import { useContext } from "react"
import { FaRegBell, FaSearch, FaWallet } from "react-icons/fa"
import { LuMessageCircleMore } from "react-icons/lu"
import { PiSuitcaseSimpleLight } from "react-icons/pi"
import { MdEdit } from "react-icons/md"
import { CgProfile } from "react-icons/cg"
import { RiTeamLine } from "react-icons/ri"
import { IoIosAddCircleOutline, IoMdPersonAdd } from "react-icons/io"
import { Outlet, Link, useLocation } from "react-router-dom"
import { ChevronDown, ChevronUp, Moon, Sun } from "lucide-react"
import { Theme, ThemeSet, UserData } from "../App"

const MainPage = () => {
    const userData = useContext(UserData)
    const location = useLocation()
    const currentPage = location.pathname.slice(1).toLowerCase()
    const [activeItem, setActiveItem] = useState(currentPage)

    // const [theme, setTheme] = useState("dark")
    const theme=useContext(Theme)
    const setTheme=useContext(ThemeSet)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
    }

    useEffect(() => {
        console.log(userData)
        const savedTheme = localStorage.getItem("theme")
        if (savedTheme) {
            setTheme(savedTheme)
        } else {
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            setTheme(systemPrefersDark ? "dark" : "light")
        }
    }, [])

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [theme])

    useEffect(() => {
        console.log("current", currentPage)
        setActiveItem(currentPage)
    }, [location])

    const handleLogout = () => {
        window.location.href = "https://talentlink-nloa.onrender.com/auth/accounts/logout"
        // window.location.href = "http://localhost:8000/auth/accounts/logout"
    }

    const navigationSections = [
        {
            items: [{ to: "/messages", icon: LuMessageCircleMore, label: "Messages", key: "messages" }],
        },
        {
            items: [
                { to: "/profile", icon: CgProfile, label: "Profile", key: "profile" },
                { to: "/canvaslist", icon: MdEdit, label: "Canvas", key: "canvaslist" },
                ...(userData?.details?.role === "client"
                    ? [{ to: "/applications", icon: CgProfile, label: "Applications", key: "applications" }]
                    : []),
                ...(userData?.details?.role === "freelancer"
                    ? [{ to: "/freelancer-application", icon: CgProfile, label: "Applications", key: "freelancer-application" }]
                    : []),
            ],
        },
        {
            items: [
                { to: "/discover", icon: FaSearch, label: "Discover", key: "discover" },
                { to: "/jobs", icon: PiSuitcaseSimpleLight, label: "Jobs", key: "jobs" },
            ],
        },
        {
            items: [
                { to: "/groups", icon: RiTeamLine, label: "Groups", key: "groups" },
                ...(userData?.details?.role !== "client"
                    ? [{ to: "/creategroup", icon: IoIosAddCircleOutline, label: "Create Group", key: "creategroup" }]
                    : []),
            ],
        },
        {
            items: [{ to: "/wallet", icon: FaWallet, label: "Wallet", key: "wallet" }],
        },
    ]

    return (
        <div
            className={`relative overflow-x-hidden   transition-colors duration-300 ${theme === "dark" ? "bg-neutral-950 text-neutral-100" : "bg-neutral-50 text-neutral-900"
                }`}
        >
            <div className="absolute inset-0 -z-10">
                <div
                    className={`absolute -top-40 -left-40 w-[50rem] h-[50rem] rounded-full blur-[120px] animate-pulse ${theme === "dark"
                        ? "opacity-25 bg-gradient-to-br from-cyan-500 to-violet-600"
                        : "opacity-15 bg-gradient-to-br from-cyan-400 to-violet-500"
                        }`}
                />
                <div
                    className={`absolute top-1/2 -right-40 w-[45rem] rounded-full blur-[120px] animate-pulse ${theme === "dark"
                        ? "opacity-20 bg-gradient-to-tr from-fuchsia-500 to-blue-500"
                        : "opacity-15 bg-gradient-to-tr from-fuchsia-400 to-blue-400"
                        }`}
                    style={{ animationDelay: "1s" }}
                />
            </div>

            <div className="h-screen flex">
                <div
                    className={`border sm:fixed sm:w-74 sm:flex sm:flex-col hidden h-full backdrop-blur supports-[backdrop-filter]:transition-colors duration-300 ${theme === "dark"
                        ? "border-white/10 bg-neutral-950/80 supports-[backdrop-filter]:bg-neutral-950/60"
                        : "border-neutral-200/50 bg-white/80 supports-[backdrop-filter]:bg-white/80"
                        }`}
                >
                    <div className="text-3xl font-extrabold flex ml-8 w-full mt-6 font-myfont">
                        <span
                            className={`font-myfont ${theme === "dark" ? "text-neutral-100" : "text-gray-800"
                                }`}
                        >
                            talentlink
                        </span>

                    </div>
                    <div className="flex flex-col space-y-3 justify-center">
                        {navigationSections.map((section, sectionIndex) => (
                            <div key={sectionIndex}>
                                <div className="flex mt-1 space-y-0.5 flex-col">
                                    {section.items.map((item) => {
                                        const IconComponent = item.icon
                                        return (
                                            <Link key={item.key} to={item.to}>
                                                <div
                                                    className={`flex mx-4 items-center gap-2 rounded-xl p-2 transition-all duration-200 ${activeItem === item.key
                                                        ? theme === "dark"
                                                            ? "bg-gradient-to-r from-cyan-500/20 to-violet-600/20 border border-cyan-500/30"
                                                            : "bg-gradient-to-r from-cyan-500/15 to-violet-600/15 border border-cyan-500/30"
                                                        : theme === "dark"
                                                            ? "hover:bg-white/10 hover:border hover:border-white/20"
                                                            : "hover:bg-neutral-100 hover:border hover:border-neutral-300"
                                                        }`}
                                                    onClick={() => setActiveItem(item.key)}
                                                >
                                                    <IconComponent
                                                        size={17}
                                                        className={theme === "dark" ? "text-neutral-300" : "text-neutral-600"}
                                                    />
                                                    <span className={theme === "dark" ? "text-neutral-200" : "text-neutral-700"}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                                {sectionIndex < navigationSections.length - 1 && (
                                    <div
                                        className={`w-[90%] border ml-4 mt-4 ${theme === "dark" ? "border-white/10" : "border-neutral-200"
                                            }`}
                                    ></div>
                                )}
                            </div>
                        ))}

                        <div
                            className={`ml-4 mt-4 flex items-center border rounded-xl mr-7 p-3 gap-2 transition-all duration-200 ${theme === "dark"
                                ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md"
                                }`}
                        >
                            <div>
                                {userData?.details?.profilepic ? (
                                    <img
                                        src={userData.details.profilepic || "/placeholder.svg"}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 animate-pulse" />
                                )}
                            </div>
                            <div className={`text-[14px] ${theme === "dark" ? "text-neutral-200" : "text-neutral-700"}`}>
                                Welcome {userData?.details?.fullname}
                            </div>
                        </div>
                        <div className="px-4 pr-7">
                            <div
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl p-2 flex justify-center font-bold text-white transition-all duration-200"
                                onClick={handleLogout}
                            >
                                Logout
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sm:ml-[296px] w-full  overflow-y-auto">
                    <header
                        className={`w-full sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:transition-colors duration-300 ${theme === "dark"
                            ? "supports-[backdrop-filter]:bg-neutral-950/60 border-b border-white/10"
                            : "supports-[backdrop-filter]:bg-white/80 border-b border-neutral-200/50"
                            }`}
                    >
                        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                            <div>
                                <div className="sm:hidden text-3xl font-myfont">
                                    <span
                                        className={`font-myfont ${theme === "dark" ? "text-neutral-100" : "text-gray-800"
                                            }`}
                                    >
                                        talentlink
                                    </span>

                                </div>
                            </div>
                            <div className="flex items-center sm:space-x-7">
                                <button
                                    onClick={toggleTheme}
                                    className={`p-2 mr-3 rounded-full transition-all duration-200 ${theme === "dark"
                                        ? "bg-white/10 hover:bg-white/20 text-yellow-300"
                                        : "bg-neutral-200 hover:bg-neutral-300 text-amber-500"
                                        }`}
                                >
                                    {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>

                                <a href="https://axectra.vercel.app/" target="_blank" rel="noreferrer">
                                    <div className="sm:flex hidden bg-gradient-to-r from-orange-300 to-red-400 hover:from-orange-500 hover:to-orange-600 border border-3 border-orange-600 rounded-full text-orange-800 font-bold p-2 px-4 transition-all duration-200">
                                        Try Axectra
                                    </div>
                                </a>
                                <div className="flex items-center gap-5 sm:gap-0 sm:space-x-7">
                                    <Link to={"/messages"}>
                                        <div>
                                            <LuMessageCircleMore
                                                size={25}
                                                className={`transition-colors duration-200 ${theme === "dark"
                                                    ? "text-neutral-400 hover:text-neutral-200"
                                                    : "text-neutral-500 hover:text-neutral-800"
                                                    }`}
                                            />
                                        </div>
                                    </Link>
                                    <Link to={"/notification"}>
                                        <div>
                                            <IoMdPersonAdd  size={25}
                                                className={`transition-colors duration-200 ${theme === "dark"
                                                    ? "text-neutral-400 hover:text-neutral-200"
                                                    : "text-neutral-500 hover:text-neutral-800"
                                                    }`}/>
                                           
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </header>
                    <Outlet />
                </div>

                <div className="sm:hidden">
                    {/* Mobile sidebar toggle button */}
                    <button
                        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                        className={`fixed bottom-2 left-1/2 -translate-x-1/2 z-50 p-2 px-7 rounded-full shadow-lg transition-all duration-300
  ${theme === "light" ? "bg-neutral-800 text-white" : "bg-neutral-200 text-black"}
  ${isMobileSidebarOpen ? "rotate-180" : ""}`}
                    >
                        <ChevronUp className="w-6 h-6" />
                    </button>


                    {isMobileSidebarOpen && (
                        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileSidebarOpen(false)} />
                    )}

                    <div
                        className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300
  ${isMobileSidebarOpen ? "translate-y-0" : "translate-y-full"}
  ${theme === "dark"
                                ? "bg-neutral-900/95 backdrop-blur-lg"
                                : "bg-white/95 backdrop-blur-lg"}
  rounded-t-3xl rounded-b-none shadow-2xl border-t border-neutral-300`}
                    >

                        
                        <div className="flex justify-center py-2">
                            <button
                                onClick={() => setIsMobileSidebarOpen(false)}
                                className={`p-2 px-7  rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition ${theme === "light" ? "bg-neutral-800 text-white" : "bg-neutral-200 text-black"}  `}
                            >
                                <ChevronDown className="w-6 h-6  " />
                            </button>
                        </div>

                        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-4">
                            {/* Navigation grid with iOS card look */}
                            <div className="grid grid-cols-2 gap-4">
                                {navigationSections.flat().map((section) =>
                                    section.items.map((item) => {
                                        const IconComponent = item.icon
                                        return (
                                            <Link key={item.key} to={item.to} onClick={() => setIsMobileSidebarOpen(false)}>
                                                <div
                                                    className={`flex flex-col items-center gap-2 rounded-2xl p-4 shadow-sm border transition-all duration-200
                ${theme === "dark"
                                                            ? "bg-neutral-800/90 border-neutral-700 hover:bg-neutral-700"
                                                            : "bg-neutral-100 border-neutral-200 hover:bg-neutral-200"}`}
                                                >
                                                    <IconComponent size={22} className={theme === "dark" ? "text-white" : "text-black"} />
                                                    <span className="text-sm font-medium">{item.label}</span>
                                                </div>
                                            </Link>
                                        )
                                    }),
                                )}
                            </div>

                            {/* Profile + Logout */}
                            <div className={`flex items-center border rounded-2xl p-4 gap-3 shadow-sm 
      ${theme === "dark" ? "bg-neutral-800/90 border-neutral-700" : "bg-neutral-100 border-neutral-200"}`}>
                                <img
                                    src={userData?.details?.profilepic || "/placeholder.svg"}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <span className="text-sm font-medium">Welcome {userData?.details?.fullname}</span>
                            </div>

                            <button
                                className="w-full bg-red-500 hover:bg-red-600 rounded-2xl p-3 font-bold text-white shadow-md transition-all duration-200"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MainPage
