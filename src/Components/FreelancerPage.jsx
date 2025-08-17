import React, { useEffect } from 'react'
import { useContext } from 'react'
import {Role,SetRole} from '../App'
import { Link } from 'react-router-dom'

const FreelancerPage = () => {
  const role=useContext(Role)
  const setRole=useContext(SetRole)
  useEffect(()=>{
    setRole('freelancer')
  },[])


  
  return (
    <div>FreelancerPage

        <Link to='/register'>Sign up</Link>
    </div>
  )
}

export default FreelancerPage