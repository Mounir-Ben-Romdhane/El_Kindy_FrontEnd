import { axiosPrivate } from "../api/axios";



export const getMessages = (id) => axiosPrivate.get(`/message/${id}`);

export const addMessage = (data) => axiosPrivate.post('/addMessage/', data);