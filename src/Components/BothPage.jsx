import React, { useEffect } from 'react'
import { useContext } from 'react'
import {Role,SetRole} from '../App'
import { Link } from 'react-router-dom'

const BothPage = () => {
    const role=useContext(Role)
  const setRole=useContext(SetRole)

  useEffect(()=>{
    setRole('both')
  },[])

  return (
    <div>BothPage
        <Link to='/register'>Sign up</Link>
    </div>
  )
}

export default BothPage