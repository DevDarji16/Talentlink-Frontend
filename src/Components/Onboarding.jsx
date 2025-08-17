import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Onboarding = () => {
  const [role, setRole] = useState()
  const navigate=useNavigate()
  useEffect(() => {

      // fetch('https://talentlink-nloa.onrender.com/check_user/', {
      fetch('http://localhost:8000/check_user/', {
        method:'GET',
            credentials: 'include'
          })
            .then(res => res.json())
            .then(data => {
              // console.log(data)
              if (data.exists) {

                navigate('/profile')
              }
              else {  
                navigate('/get-details')
              }
            })
    
    



  }
    , [])
  return (
    
    <div>Hiii</div>
  )
}

export default Onboarding