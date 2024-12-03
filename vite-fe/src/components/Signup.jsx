import React, { useState } from 'react'
import NavBar from '../NavBar'
import './Auth.css'
import { addUser } from '../APIs/Authentication'
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [account, setAccount] = useState({
    username: '',
    password: ''
  })
  const [cpassword, setCpassword] = useState("")
  const [errorMessage, setErrorMessage] = useState()

  const signUp = (e) =>{
    e.preventDefault()
    if (!cpassword.match(account.password)) {
      setErrorMessage("Password mismatch")
      return
    }
    console.log(account);
    addUser(account)
    .then(res=>navigate("/login"))
    .catch(err=>{
      console.log(err.response.data)
      setErrorMessage(err.response.data.error)
    })
  }
  return (
    <>
    <NavBar />
    <div className='auth-page'>
      <div className="auth-container">
        <div style={{fontSize: '24px'}}>
          Sign up
        </div>
        <hr />
        <form onSubmit={signUp}>
          <div className='form-inputs'>
            <input type="text" name="username" id="username" placeholder='Username'
            value={account.username} onChange={(e)=>setAccount({...account, username: e.target.value})}/>
            <input type="text" name="cpassword" id="cpassword" placeholder='Password'
            value={cpassword} onChange={(e)=>setCpassword(e.target.value)}/>
            <input type="password" name="password" id="password" placeholder='Confirm password'
            value={account.password} onChange={(e)=>setAccount({...account, password: e.target.value})}/>
          </div>
          {errorMessage && <div className='auth-error'>{errorMessage}</div>}
          <div className="form-submit">
            <input type="submit" value="Sign up" />
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
