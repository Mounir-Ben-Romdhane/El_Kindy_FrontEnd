import { axiosPrivate } from "../api/axios";

import axios from 'axios'


export const getUser = (userId) => axiosPrivate.get(`/auth/${userId}`);
