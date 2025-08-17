import React,{useContext} from 'react'
import {Role,SetRole} from '../App'

const Register = () => {
    const role=useContext(Role)
    const setRole=useContext(SetRole)
    const handleSignUp=()=>{
       
        localStorage.setItem("selected_role", role)
        //  window.location.href='https://talentlink-nloa.onrender.com/auth/accounts/google/login'
         window.location.href='http://localhost:8000/auth/accounts/google/login'
    }
  return (
    <div>
       <div>
        Register Page</div> 

        <button onClick={handleSignUp}>
            Sign up with google
        </button>

    </div>
  )
}

export default Register