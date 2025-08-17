import React, { useEffect } from 'react'
import { useContext } from 'react'
import {Role,SetRole} from '../App'
import { Link } from 'react-router-dom'

const ClientPage = () => {
    const role=useContext(Role)
  const setRole=useContext(SetRole)
  useEffect(()=>{
    setRole('client')
  },[])
  return (
    <div>Client page
        <Link to='/register'>Sign up</Link>
    </div>
  )
}

export default ClientPage