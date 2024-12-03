import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Context from './context/Context'
import { verifytoken } from './APIs/Authentication'

export default function NavBar() {
  const navigate = useNavigate()
  const {authenticated, setAuthenticated, setRole, pageloaded, setPageloaded, setUser} = useContext(Context)

  useEffect(()=>{
    if (pageloaded) {
      return
    }
    if(!authenticated) {
      const token = localStorage.getItem("token")
      if (token) {
        verifytoken(localStorage.getItem("token"))
          .then(res=>{
            console.log("token verified");
            setAuthenticated(true);
            setRole(res.data.role);
            setUser(res.data.account)
          })
          .catch(err=>{console.log("token verification error");localStorage.removeItem("token");setAuthenticated(false);setRole();setAcc})
          .finally(()=>setPageloaded(true))
      } else {
        setPageloaded(true)
      }
    }
  },[])

  const handleLogOut = () => {
    localStorage.removeItem("token")
    setAuthenticated(false)
    setRole()
    navigate("/login")
  }

  return (
    <>
    <nav style={{padding: '0 8px',display: 'flex', justifyContent: 'space-between', background: 'white', borderRadius: '5px', marginBottom: '3px'}}>
        <div className="badge" style={{display: 'flex', alignItems: 'center', fontSize: '24px'}}>
          <Link to={"/"} style={{color: 'black', textDecoration: 'none'}}>Secure</Link>
        </div>
        <div className="nav-links">
          {authenticated?<Logout handleLogOut={handleLogOut}/>:<Links />}
        </div>
    </nav>
    </>
  )
}

const Links =()=>{
  return(
    <ul style={{listStyle: 'none', display: 'flex'}}>
      <li style={{padding: '0 5px'}}>
        <Link to={"/login"} style={{color: 'black', textDecoration: 'none'}}>Login</Link>
      </li>
      <li>
        <Link to={"/signup"} style={{color: 'black', textDecoration: 'none'}}>Sign Up</Link>
      </li>
    </ul>
  )
}

const Logout = ({handleLogOut}) =>{
  return(
    <ul style={{listStyle: 'none'}}>
      <li>
        <button style={{cursor: 'pointer'}} onClick={handleLogOut}>Logout</button>
      </li>
    </ul>
  )
}