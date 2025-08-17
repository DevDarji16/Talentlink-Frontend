import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { UserData } from '../App'
import { FaRegBell, FaSearch, FaWallet } from 'react-icons/fa'
import { LuMessageCircleMore } from 'react-icons/lu'
import { PiSuitcaseSimpleLight } from 'react-icons/pi'
import { MdEdit, MdSpaceDashboard } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'
import { RiTeamLine } from 'react-icons/ri'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { Outlet, Link, useLocation } from 'react-router-dom'
const MainPage = () => {
    const userData = useContext(UserData)
    const location = useLocation()
    const currentPage = location.pathname.slice(1).toLowerCase();
    const [activeItem, setActiveItem] = useState(currentPage)
    useEffect(() => {
        console.log('current', currentPage)
        setActiveItem(currentPage)
    }, [location])

    const handleLogout = () => {
        window.location.href = 'http://localhost:8000/auth/accounts/logout'
    }
    return (
        <div className='h-screen flex'>
            {/* Sidebar */}
            <div className='border border-gray-300 sm:fixed sm:w-74 sm:flex sm:flex-col hidden  h-full'>
                <div className='text-3xl font-extrabold flex ml-8 w-full mt-6 text-gray-600 font-myfont'>talentlink</div>
                <div className='flex flex-col space-y-3 justify-center '>




                    <div className='flex mt-7 space-y-2 flex-col  '>
                            {/* <Link to={'/dashboard'}>
                                <div className={`flex mx-4 items-center gap-2 rounded-xl p-2 cursor-pointer
        ${activeItem === 'dashboard' ? 'bg-violet-100' : 'hover:bg-violet-100'}`}
                                    onClick={() => setActiveItem('dashboard')}><MdSpaceDashboard size={17} className='text-gray-600' />Dashboard</div></Link> */}

                        <Link to={'/messages'}>
                            <div className={`flex mx-4 items-center gap-2 rounded-xl p-2 cursor-pointer
    ${activeItem === 'messages' ? 'bg-violet-100' : 'hover:bg-violet-100'}`}
                                onClick={() => setActiveItem('messages')}>{<LuMessageCircleMore size={17} className='text-gray-600' />}Messages</div></Link>

                    </div>

                    <div className='w-[90%] border ml-4 border-gray-300  '></div>

                    <div className='flex  space-y-2 flex-col '>

                        <Link to={'/profile'}>  <div className={`flex mx-4 items-center gap-2 rounded-xl p-2 cursor-pointer
    ${activeItem === 'profile' ? 'bg-violet-100' : 'hover:bg-violet-100'}`}
                            onClick={() => setActiveItem('profile')}><CgProfile className='text-gray-600' size={17} />Profile</div></Link>

                        <Link to={'/canvaslist'}>  <div className={`flex mx-4 items-center gap-2 rounded-xl p-2 cursor-pointer
    ${activeItem === 'canvas' ? 'bg-violet-100' : 'hover:bg-violet-100'}`}
                            onClick={() => setActiveItem('canvas')}><MdEdit className='text-gray-600' size={17} />Canvas</div></Link>

                            {userData?.details?.role==='client'?
                             <Link to={'/applications'}>  <div className={`flex mx-4 items-center gap-2 rounded-xl p-2 cursor-pointer
    ${activeItem === 'applications' ? 'bg-violet-100' : 'hover:bg-violet-100'}`}
                            onClick={() => setActiveItem('applications')}><CgProfile className='text-gray-600' size={17} />Applications</div></Link>
                            :''}
                            {userData?.details?.role==='freelancer'?
                             <Link to={'/freelancer-application'}>  <div className={`flex mx-4 items-center gap-2 rounded-xl p-2 cursor-pointer
    ${activeItem === 'applications' ? 'bg-violet-100' : 'hover:bg-violet-100'}`}
                            onClick={() => setActiveItem('applications')}><CgProfile className='text-gray-600' size={17} />Applications</div></Link>
                            :''}
                           


                    </div>

                    <div className='w-[90%] border ml-4 border-gray-300  '></div>


                    <div className='flex  space-y-2 flex-col '>

                        <Link to={'/discover'}>   <div className={`flex mx-4 items-center gap-2 rounded-xl p-2 cursor-pointer
    ${activeItem === 'discover' ? 'bg-violet-100' : 'hover:bg-violet-100'}`}
                            onClick={() => setActiveItem('discover')}><FaSearch size={14} className='text-gray-600' />Discover</div></Link>
                        <Link to={'/jobs'}>  <div className={`flex mx-4 items-center gap-2 rounded-xl p-2 cursor-pointer
    ${activeItem === 'jobs' ? 'bg-violet-100' : 'hover:bg-violet-100'}`}
                            onClick={() => setActiveItem('jobs')}><PiSuitcaseSimpleLight size={17} />Jobs</div></Link>
                    </div>

                    <div className='w-[90%] border ml-4 border-gray-300  '></div>


                    <div className='flex  space-y-2 flex-col '>

                        <Link to={'/groups'}>  <div className={`flex mx-4 items-center gap-2 rounded-xl p-2 cursor-pointer
    ${activeItem === 'groups' ? 'bg-violet-100' : 'hover:bg-violet-100'}`}
                            onClick={() => setActiveItem('groups')}><RiTeamLine size={17} />Groups</div></Link>
                        {userData?.details?.role === 'client' ? '' :
                            <Link to={'/creategroup'}> <div className={`flex mx-4 items-center gap-2 rounded-xl p-2 cursor-pointer
    ${activeItem === 'creategroup' ? 'bg-violet-100' : 'hover:bg-violet-100'}`}
                                onClick={() => setActiveItem('creategroup')}><IoIosAddCircleOutline size={17} /> Create Group</div></Link>}

                    </div>

                    <div className='w-[90%] border ml-4 border-gray-300  '></div>


                    <div className='flex  space-y-2 flex-col '>


                        <Link to={'/wallet'}>  <div className={`flex mx-4 items-center gap-2 rounded-xl p-2 cursor-pointer
    ${activeItem === 'wallet' ? 'bg-violet-100' : 'hover:bg-violet-100'}`}
                            onClick={() => setActiveItem('wallet')}><FaWallet className='text-gray-700' size={17} />Wallet</div></Link>
                    </div>

                    <div className='ml-4 mt-4 hover:cursor-pointer  flex items-center border rounded-xl mr-7 p-3 gap-2'>
                        <div>
                            {userData?.details?.profilepic ? (
                                <img
                                    src={userData.details.profilepic}
                                    alt="Profile"
                                    className=" w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-400 animate-pulse" />
                            )}
                        </div>
                        <div className='text-[14px]'>Welcome {userData?.details?.fullname}</div>
                    </div>
                    <div className='px-4 pr-7'>

                        <div className=' bg-red-400 hover:bg-red-500 rounded-xl p-2 flex justify-center hover:cursor-pointer font-bold' onClick={handleLogout}>Logout</div>
                    </div>

                </div>
            </div>
            <div className='sm:ml-[296px] w-full h-screen overflow-y-auto'>
                <div>{/* Header */}
                    <header className="w-full bg-white shadow-sm sticky top-0 z-10 border-b">
                        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                            <div>

                                <div className='sm:hidden text-3xl font-myfont text-gray-600'>talentlink</div>
                            </div>
                            <div className="flex items-center sm:space-x-7">
                                <a href="https://axectra.vercel.app/" target='_blank'><div className='hover:cursor-pointer sm:flex hidden bg-orange-300 rounded-full border border-2 text-orange-800 font-bold border-orange-600 p-2'>Try Axectra</div></a>
                                <div className="flex items-center gap-5 sm:gap-0 sm:space-x-7">
                                    <div><Link to={'/messages'}><div>{<LuMessageCircleMore size={25} className='text-gray-500 hover:cursor-pointer' />}</div></Link>
                                    </div>
                                    <div><Link to={'/notification'}><div><FaRegBell size={25} className='text-gray-500 hover:cursor-pointer' />  </div></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header></div>
                <Outlet /></div>
        </div>
    )
}

export default MainPage