import React, { useContext, useEffect, useState } from 'react'
import './Addasset.css'
import Context from '../context/Context'
import { hasPermission } from '../access/PermissionService'
import { useNavigate, useParams } from 'react-router-dom'
import AssetApis from '../APIs/AssetApis'
import NavBar from '../NavBar'

export default function EditAsset() {
    const {pageloaded, authenticated, role, user} = useContext(Context)
    const navigate = useNavigate()
    const {assetId} = useParams()
    const [asset, setAsset] = useState({
        assetId: 0,
        name: "",
        price: 0,
        account: null
    })

    useEffect(()=>{
        AssetApis.getAssetWithId(assetId, localStorage.getItem("token"))
            .then(res=>{
                setAsset(res.data)
            })
            .catch(err=>console.log(err.response))
    },[])

    useEffect(()=>{
        if(pageloaded && asset.account) {
            if(asset.account.id===user.id) {
                if (!hasPermission(authenticated, role, ["update:asset", "update:ownAsset"])) {
                    navigate("/")
                }
            } else if(!hasPermission(authenticated, role, ["update:asset"])) {
                navigate("/")
            }
        }
    },[pageloaded, authenticated, asset, user])

    const handleEditAsset = (e) =>{
        e.preventDefault()
        console.log(asset)
        let account = {id: asset.account.id}
        let assetToEdit = asset
        assetToEdit.account=account
        AssetApis.editAsset(asset, localStorage.getItem("token"))
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
            <form onSubmit={handleEditAsset}>
                <div className="form-inputs">
                    <input type="number" name="id" id="id" value={asset.assetId} disabled/>
                    <input type="text" name="name" id="name" placeholder='Asset name' required
                    value={asset.name} onChange={(e)=>setAsset({...asset, name: e.target.value})}/>
                    <input type="number" name="price" id="price" placeholder='price' required
                    value={asset.price} onChange={(e)=>setAsset({...asset, price: e.target.value})}/>
                </div>
                <div style={{display: 'flex', justifyContent: 'end'}}>
                    <input type="submit" value="Update" />
                </div>
            </form>
        </div>
        </div>
        </>
    )
}
