import React, { useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Theme, ThemeSet, UserData } from '../../App';

const Discover = () => {
  const userData=useContext(UserData)
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme=useContext(Theme)
  const setTheme=useContext(ThemeSet)

  useEffect(() => {
    const fetchGigs = async () => {

      try {
        // const res = await fetch('http://localhost:8000/gigs/');
        const res = await fetch('/gigs/');
        const data = await res.json();
        setGigs(data);
      } catch (err) {
        console.error('Error fetching gigs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold ">Discover Gigs</h2>
        <div className="flex space-x-2">
          <div>
            {userData?.details?.role!=='client'?
            
            
            <Link to={'/add_gig'} >   <button className="px-4 justify-center font-bold items-center flex gap-1 py-2 bg-gray-200 hover:cursor-pointer text-gray-800 rounded-lg text-sm hover:bg-gray-300 transition">
              <IoMdAdd size={20} />Add Gig
            </button></Link>
            :
            
            <div></div>
            }
          </div>
        </div>

      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600 border-opacity-50"></div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-start gap-4">
          {gigs.map((gig) => (
            <Link
              key={gig.id}
              to={`/gig/${gig.id}`}
              className="flex-none w-full sm:w-78  border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
                <img
                  src={gig.images[0]}
                  alt={gig.title}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-semibold  line-clamp-2">{gig.title}</h3>
                  <span className="ml-2 px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full whitespace-nowrap">
                    ${gig.price}/hr
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 capitalize">{gig.category}</p>
                <p className="mt-2 text-sm  line-clamp-2">{gig.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {gig.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-2 py-0.5 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discover;