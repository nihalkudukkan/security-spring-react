import React, { useContext, useEffect, useState } from 'react'
import NavBar from '../NavBar'
import Context from '../context/Context'
import { useNavigate } from 'react-router-dom'
import { hasPermission } from '../access/PermissionService'
import './Addasset.css'
import AssetApis from '../APIs/AssetApis'

export default function Addasset() {
  const navigate = useNavigate()
  const {pageloaded, authenticated, setAuthenticated, role, setRole} = useContext(Context)

  const [asset, setAsset] = useState({
    name: "",
    price: 0,
    account: null
  })

  useEffect(()=>{
    if (pageloaded) {
      if(!hasPermission(authenticated, role, ["create:asset"])) {
        localStorage.removeItem("token")
        setAuthenticated(false)
        setRole()
        navigate("/login")
      }
    }
  },[pageloaded, authenticated, role])

  const handleAddAsset = (e) =>{
    e.preventDefault()
    console.log(asset)
    AssetApis.addAsset(asset,localStorage.getItem("token"))
      .then(res=>navigate("/"))
      .catch(err=>console.log(err.response))
  }

  return (
    <>
    <NavBar />
    <div className="addasset-page">
      <div className="addasset-container">
        <div style={{fontSize: '24px'}}>Addasset</div>
        <hr />
        <form onSubmit={handleAddAsset}>
          <div className="form-inputs">
            <input type="text" name="name" id="name" placeholder='Asset name' required
            value={asset.name} onChange={(e)=>setAsset({...asset, name: e.target.value})}/>
            <input type="number" name="price" id="price" placeholder='price' required
            value={asset.price} onChange={(e)=>setAsset({...asset, price: e.target.value})}/>
          </div>
          <div style={{display: 'flex', justifyContent: 'end'}}>
            <input type="submit" value="Add" />
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
