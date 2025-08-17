import React, { useState, useEffect } from "react";
import {
  FaHome, FaGlobe, FaEnvelope, FaUser, FaChartBar,
  FaSearch, FaBriefcase, FaFolderOpen, FaWallet, FaBars, FaTimes,
  FaHeart, FaEye, FaChevronDown
} from "react-icons/fa";

const Discover = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f9f9f9] text-gray-900 font-sans relative">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden bg-white px-4 py-3 border-b sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
          <span className="text-lg font-bold">contra</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-1 rounded-md hover:bg-gray-100"
          aria-label="Open menu"
        >
          <FaBars className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out px-4 py-6 space-y-4 overflow-y-auto`}
      >
        {/* Close on mobile */}
        <div className="flex items-center justify-between md:hidden mb-4">
          <span className="text-xl font-bold">Menu</span>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-gray-100"
            aria-label="Close menu"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
          <span className="text-xl font-bold">contra</span>
        </div>

        <div className="mt-6">
          <div className="text-xs text-gray-500 mb-2">Independent workspace</div>
          <div className="flex items-center space-x-2">
            <img
              src="https://avatars.githubusercontent.com/u/1?v=4"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">Dev Darji</p>
              <p className="text-xs text-gray-500 truncate">Free plan</p>
            </div>
            <FaChevronDown className="w-3 h-3 text-gray-400" />
          </div>
        </div>

        <nav className="space-y-1 pt-4">
          <NavItem icon={<FaHome />} label="Dashboard" />
          <NavItem icon={<FaGlobe />} label="Community" badge="BETA" />
          <NavItem icon={<FaEnvelope />} label="Messages" />
        </nav>

        <div className="pt-4">
          <div className="text-xs text-gray-400 uppercase mb-2">Identity</div>
          <NavItem icon={<FaUser />} label="Profile" />
          <NavItem icon={<FaChartBar />} label="Analytics" />
        </div>

        <div className="pt-4">
          <div className="text-xs text-gray-400 uppercase mb-2">Leads</div>
          <NavItem icon={<FaSearch />} label="Discover" active />
          <NavItem icon={<FaBriefcase />} label="Jobs" />
        </div>

        <div className="pt-4">
          <div className="text-xs text-gray-400 uppercase mb-2">Projects & Payments</div>
          <NavItem icon={<FaFolderOpen />} label="Projects & invoices" />
          <NavItem icon={<FaWallet />} label="Wallet" trailing="$0.00" />
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold">Discover</h1>
          <button className="bg-white border px-4 py-2 rounded-full shadow text-sm font-medium text-yellow-500 hover:bg-yellow-50 whitespace-nowrap">
            ✨ Contra Pro
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search across 1M+ independents..."
              className="w-full pl-10 pr-4 py-2 border rounded-full bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm bg-gray-100 rounded-full hover:bg-gray-200 whitespace-nowrap">
              Projects
            </button>
            <button className="px-4 py-2 text-sm bg-gray-100 rounded-full hover:bg-gray-200 whitespace-nowrap">
              People
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex space-x-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {['Featured', 'Up & coming', 'Web developers', 'Jitter', 'Content creators', 'Graphic designers', 'Motion designers'].map((filter, i) => (
            <button
              key={i}
              className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${
                i === 0 ? 'bg-gray-200' : 'bg-white border hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Projects we love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))} */}
          </div>
        </section>

        {/* People Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Top creatives</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {/* {people.map((person, index) => (
              <PersonCard key={index} person={person} />
            ))} */}
          </div>
        </section>
      </main>
    </div>
  );
};

const ProjectCard = ({ project }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="relative pb-[66.66%] rounded-md overflow-hidden mb-2">
      <img 
        src={project.img} 
        alt={project.name} 
        className="absolute inset-0 w-full h-full object-cover" 
      />
    </div>
    <div className="flex justify-between items-center">
      <span className="font-medium truncate">{project.name}</span>
      {project.pro && <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">PRO</span>}
    </div>
    <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
      <span className="flex items-center space-x-1">
        <FaHeart className="w-3 h-3" />
        <span>{project.likes}</span>
      </span>
      <span className="flex items-center space-x-1">
        <FaEye className="w-3 h-3" />
        <span>{project.views}</span>
      </span>
    </div>
  </div>
);

const PersonCard = ({ person }) => (
  <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <img 
      src={person.avatar} 
      alt={person.name} 
      className="w-16 h-16 rounded-full mb-2 object-cover" 
    />
    <h3 className="font-medium truncate w-full">{person.name}</h3>
    <p className="text-xs text-gray-500 truncate w-full">{person.role}</p>
    <div className="flex items-center text-xs text-gray-500 mt-1 space-x-1">
      <FaHeart className="w-3 h-3" />
      <span>{person.likes}</span>
    </div>
  </div>
);

const NavItem = ({ icon, label, badge, trailing, active }) => (
  <div
    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
      active ? "bg-gray-100 font-medium" : ""
    }`}
  >
    <div className="flex items-center space-x-3">
      <span className="text-gray-500">{icon}</span>
      <span>{label}</span>
      {badge && (
        <span className="text-xs text-purple-600 font-semibold bg-purple-100 px-1.5 rounded">
          {badge}
        </span>
      )}
    </div>
    {trailing && <span className="text-sm text-gray-500">{trailing}</span>}
  </div>
);

// Sample data
const projects = [
  {
    img: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    name: "Vic Rojo",
    likes: 16,
    views: 247,
    pro: true,
  },
  {
    img: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    name: "Kuba Gawlik",
    likes: 18,
    views: 312,
    pro: true,
  },
  {
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    name: "Jason Debiak",
    likes: 49,
    views: 854,
  },
  {
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    name: "Robin Holesinsky",
    likes: 0,
    views: 0,
  },
];

const people = [
  {
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Alex Morgan",
    role: "UI/UX Designer",
    likes: 124,
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Jamie Smith",
    role: "Frontend Dev",
    likes: 98,
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    name: "Taylor Swift",
    role: "Motion Designer",
    likes: 256,
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    name: "Chris Evans",
    role: "Fullstack Dev",
    likes: 187,
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    name: "Emma Watson",
    role: "Content Creator",
    likes: 312,
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    name: "Michael Jordan",
    role: "Graphic Designer",
    likes: 76,
  },
];

export default Discover;