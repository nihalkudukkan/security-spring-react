import React, { useContext, useState } from 'react'
import NavBar from '../NavBar'
import { login } from '../APIs/Authentication'
import Context from '../context/Context'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate();
  const [account, setAccount] = useState({
    username: '',
    password: ''
  })
  const [errorMessage, setErrorMessage] = useState()
  const { setAuthenticated, setRole, setUser } = useContext(Context)

  const handleLogin = (e) =>{
    e.preventDefault()
    login(account)
    .then(res=>{
      localStorage.setItem("token", res.data.accessToken)
      setAuthenticated(true)
      setRole(res.data.role)
      setUser(res.data.account)
      navigate("/")
    })
    .catch(err=>setErrorMessage("Username or password wrong"))
  }

  return (
    <>
    <NavBar />
    <div className='auth-page'>
      <div className="auth-container">
        <div style={{fontSize: '24px'}}>
          Login
        </div>
        <hr />
        <form onSubmit={handleLogin}>
          <div className='form-inputs'>
            <input type="text" name="username" id="username" placeholder='Username'
            value={account.username} onChange={(e)=>setAccount({...account, username: e.target.value})}/>
            <input type="password" name="password" id="password" placeholder='password'
            value={account.password} onChange={(e)=>setAccount({...account, password: e.target.value})}/>
          </div>
          {errorMessage && <div className='auth-error'>{errorMessage}</div>}
          <div className="form-submit">
            <input type="submit" value="Login" />
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
