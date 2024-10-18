import axios from "axios";

export const api = axios.create({
    baseURL: 'https://api-v7-production.up.railway.app',
    //baseURL: 'http://localhost:3333'
})