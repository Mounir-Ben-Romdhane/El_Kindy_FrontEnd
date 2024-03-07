import axios from 'axios';
const BASE_URL = 'http://localhost:3001';
const BASE_URL_HOSTED = "https://el-kindy-project-backend.onrender.com";

export default axios.create({
    baseURL: BASE_URL_HOSTED
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL_HOSTED,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});