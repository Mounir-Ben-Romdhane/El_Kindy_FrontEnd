import { axiosPrivate } from "api/axios";

export const getAllClasses = async (id) => {
    const reponse = await axiosPrivate.get(`/classes/getAll`);
    return reponse;
}