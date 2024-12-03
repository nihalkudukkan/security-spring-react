import { useContext, useEffect, useState } from 'react'
import './App.css'
import NavBar from './NavBar'
import Context from './context/Context'
import { Link } from 'react-router-dom';
import AssetApis from './APIs/AssetApis';
import { hasPermission } from './access/PermissionService';

function App() {
  const {authenticated, role, pageloaded, user} = useContext(Context);
  const [assets, setAssets] = useState([])

  useEffect(()=>{
    AssetApis.getAllAsset()
      .then(res=>{setAssets(res.data)})
      .catch(err=>{console.log(err.response)})
  },[])

  const handleRemove = (id) =>{
    AssetApis.deleteAsset(id,localStorage.getItem("token"))
      .then(res=>{
        setAssets(res.data)
      })
      .catch(err=>console.log(err.response))
  }

  return (
    <>
    <NavBar />
      <div className="page">
        <div className="auth-info">
          {authenticated && "Authenticated"}
          <div>{role}</div>
        </div>
        <div className="home-container">
          {hasPermission(authenticated, role, ["create:asset"]) && <Link className='addasset-button' to={"/addasset"}>Add asset</Link>}
          <div className="asset-container">
            {assets && assets.map((asset, i)=>
              <AssetCard key={i} asset={asset} authenticated={authenticated} user={user} handleRemove={handleRemove} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const AssetCard = ({asset, authenticated, user, handleRemove}) => {
  const checkRemovePermission = () =>{
    if (!authenticated) {
      return false
    }
    if (asset.account.id===user.id) {
      return hasPermission(authenticated, user.role, ["delete:asset", "delete:ownAsset"])
    }
    return hasPermission(authenticated, user.role, ["delete:asset"])
  }

  const checkEditPermission = () =>{
    if (!authenticated) {
      return false
    }
    if (asset.account.id===user.id) {
      return hasPermission(authenticated, user.role, ["update:asset", "update:ownAsset"])
    }
    return hasPermission(authenticated, user.role, ["update:asset"])
  }

  return(
    <div className="card">
      <p>{asset.name}</p>
      <p>{asset.price}</p>
      <p>{asset.account.username}</p>
      <div style={{display: 'flex', justifyContent: 'end'}}>
        {checkEditPermission() &&
          <Link to={`/editasset/${asset.assetId}`} className='edit-button'>Edit</Link>
        }  
        {checkRemovePermission() && 
          <button onClick={()=>handleRemove(asset.assetId)} style={{fontFamily: 'Inter, sans-serif'}}>Remove</button>
        }
      </div>
    </div>
  )
}

export default App
