import axios from "axios";

const url = import.meta.env.VITE_API_URL;

export function addUser(user) {
    return axios.post(`${url}/public/adduser`,user,{})
}

export function login(user) {
    return axios.post(`${url}/public/login`,user)
}

export function verifytoken(token) {
    return axios.get(`${url}/verifytoken`,{
        headers: {
            Authorization: token
        }
    })
}