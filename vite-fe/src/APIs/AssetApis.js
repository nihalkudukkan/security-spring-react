import axios from "axios";

class AssetApis {
    constructor() {
        this.url=import.meta.env.VITE_API_URL;
    }
    getAllAsset() {
        return axios.get(`${this.url}/public/allassets`)
    }
    getAssetWithId(id, token) {
        return axios.get(`${this.url}/asset/${id}`, {
            headers: {
                Authorization: token
            }
        })
    }
    addAsset(asset,token) {
        return axios.post(`${this.url}/user/addasset`, asset, {
            headers: {
                Authorization: token
            }
        })
    }
    editAsset(asset, token) {
        return axios.put(`${this.url}/asset/${asset.assetId}`, asset, {
            headers: {
                Authorization: token
            }
        })
    }
    deleteAsset(id, token) {
        return axios.delete(`${this.url}/asset/${id}`, {
            headers: {
                Authorization: token
            }
        })
    }
}

export default AssetApis = new AssetApis()