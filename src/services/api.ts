import axios from "axios";

export const api = axios.create({
    baseURL: 'https://appapiv8.sintrop.com',
    //baseURL: 'http://localhost:3333'
})