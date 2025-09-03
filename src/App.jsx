import React, { useState, createContext, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import FreelancerPage from './Components/FreelancerPage'
import ClientPage from './Components/ClientPage'
import BothPage from './Components/BothPage'
import Home from './Components/Home'
import Onboarding from './Components/Onboarding'
import Register from './Components/Register'
import Profile from './Components/MainPage/Profile'
import GetDetails from './Components/GetDetails'
import NotFound from './Components/NotFound'
import { apiClient } from './apiClient'
import Discover from './Components/MainPage/Discover'
import MainPage from './Components/MainPage'
import Dashboard from './Components/MainPage/Dashboard'
import Messages from './Components/MainPage/Messages'
import Analytics from './Components/MainPage/Analytics'
import CreateGroup from './Components/MainPage/CreateGroup'
import Groups from './Components/MainPage/Groups'
import Wallet from './Components/MainPage/Wallet'
import Jobs from './Components/MainPage/Jobs'
import EditProfile from './Components/MainPage/EditProfile'
import FreelancerProfile from './Components/FreelancerProfile'
import AddProject from './Components/MainPage/AddProject'
import EditProject from './Components/MainPage/EditProject'
import AddGig from './Components/MainPage/AddGig'
import AddJob from './Components/MainPage/AddJob'
import JobPage from './Components/MainPage/JobPage'
import GigPage from './Components/MainPage/GigPage'
import Applications from './Components/MainPage/Applications'
import GroupDetailed from './Components/MainPage/GroupDetailed'
import Notifications from './Components/MainPage/Notifications'
import CanvasList from './Components/MainPage/CanvasList'
import CanvasEditor from './Components/MainPage/CanvasEditor'
import { Toaster } from 'react-hot-toast'
import FreelancerApplications from './Components/MainPage/FreelancerApplications'
import DraftDetail from './Components/DraftDetail'
import ChatbotWidget from './Components/ChatbotWidget'
import JobDetail from './Components/JobDetail'
import TalentLinkHome from './Components/TalentLinkHome'

export const Role = createContext()
export const SetRole = createContext()
export const IsLoggedIn = createContext()
export const UserData = createContext()
export const Theme = createContext()
export const ThemeSet = createContext()
const App = () => {
  const [role, setRole] = useState('')
  const [theme, setTheme] = useState("light");
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState({})
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const location = useLocation()
//   useEffect(() => {
//   fetch("https://talentlink-nloa.onrender.com/csrf/", {
//     method: "GET",
//     credentials: "include", 
//   });
// }, []);
//   useEffect(() => {

//     const check_login = async () => {
//       const data=await apiClient('/check_login/','GET')
//       // const data = await apiClient('http://localhost:8000/check_login/', 'GET')
//       setIsLoggedIn(data.authenticated)
//       setUserData(data)
//       console.log('userdata', data)

//       if (data.authenticated) {
//         if (location.pathname === '/') {

//           // navigate('/profile')
//         }

//       }


//     }
//     check_login()
//   }, [])

 useEffect(() => {
    const initializeApp = async () => {
      try {
        // Step 1: ALWAYS fetch the CSRF token first to set the cookie.
        console.log("Fetching CSRF token...");
        await fetch("https://talentlink-nloa.onrender.com/csrf/", {
          method: "GET",
          credentials: "include",
        });
        console.log("CSRF token request sent. Now checking login status.");

        // Step 2: Now that the cookie is likely set, check the login status.
        const data = await apiClient('/check_login/', 'GET');
        setIsLoggedIn(data.authenticated);
        setUserData(data);
        console.log('userdata', data);

      } catch (error) {
        console.error("Initialization failed:", error);
        // Still set logged out state on error
        setIsLoggedIn(false);
        setUserData({});
      } finally {
        // Step 3: Stop showing the loading screen
        setLoading(false);
      }
    };

    initializeApp();
  }, []); // The empty array [] ensures this runs only once on app startup.


  return (
    <div onClick={() => setIsOpen(false)}>
      <Theme.Provider value={theme}>
      <ThemeSet.Provider value={setTheme}>

      
      <ChatbotWidget isOpen={isOpen} setIsOpen={setIsOpen} />
      <IsLoggedIn.Provider value={isLoggedIn}>
        <UserData.Provider value={userData}>

          <Role.Provider value={role}>
            <SetRole.Provider value={setRole}>

              <Routes>
                {/* <Route path='/' element={<Home />} /> */}
                <Route path='/' element={<TalentLinkHome />} />
                <Route path='/independents' element={<FreelancerPage />} />
                <Route path='/clients' element={<ClientPage />} />
                <Route path='/hybrid' element={<BothPage />} />
                <Route path='/onboarding' element={<Onboarding />} />
                <Route path='/get-details' element={<GetDetails />} />
                <Route path='/register' element={<Register />} />
                <Route path='/mainpage' element={<MainPage />} />
                <Route path='*' element={<NotFound />} />
                <Route element={<MainPage />}>
                <Route path="/canvas/:canvasId" element={<CanvasEditor />} />
                  <Route path='/freelancer/:username' element={<FreelancerProfile />} />
                  <Route path='/applications' element={<Applications />} />
                  <Route path='/groups/:id' element={<GroupDetailed />} />
                  <Route path='/canvaslist' element={<CanvasList />} />
                  <Route path='/freelancer-application' element={<FreelancerApplications />} />
                  <Route path='/add_project' element={<AddProject />} />
                  <Route path='/add_gig' element={<AddGig />} />
                  <Route path='/add_job' element={<AddJob />} />
                  <Route path='/notification' element={<Notifications />} />
                  <Route path='/edit_project/:id' element={<EditProject />} />
                  <Route path='/profile' element={<Profile />} />
                  <Route path='/discover' element={<Discover />} />
                  <Route path='/dashboard' element={<Dashboard />} />
                  <Route path='/messages' element={<Messages />} />
                  <Route path='/analytics' element={<Analytics />} />
                  <Route path='/creategroup' element={<CreateGroup />} />
                  <Route path='/groups' element={<Groups />} />
                  <Route path='/wallet' element={<Wallet />} />
                  <Route path='jobs' element={<Jobs />} >
                    <Route path=':id'  element={<JobPage />} />
                  </Route>
                  <Route path='/editprofile' element={<EditProfile />} />
                  <Route path='/gig/:id' element={<GigPage />} />
                  <Route path='/draft/:id' element={<DraftDetail />} />
                    <Route path='/job/:id' element={<JobPage />} />
                    <Route path='/jobstatus/:id' element={<JobDetail />} />
                </Route>

              </Routes>
              <Toaster position="top-right" />

            </SetRole.Provider>
          </Role.Provider>
        </UserData.Provider>
      </IsLoggedIn.Provider>
      </ThemeSet.Provider>
      </Theme.Provider>

    </div>
  )
}

export default App