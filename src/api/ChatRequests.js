import axios from 'axios'
import { axiosPrivate } from "../api/axios";



export const createChat = (data) => axiosPrivate.post('/chat', data);

export const userChats = (id) => axiosPrivate.get(`/chat/${id}`);

export const findChat = (firstId, secondId) => axios.get(`/chat/find/${firstId}/${secondId}`);