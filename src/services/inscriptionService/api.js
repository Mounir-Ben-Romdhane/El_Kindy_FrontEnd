import { axiosPrivate } from "api/axios";

export const getInscription = async (id) => {
    const reponse = await axiosPrivate.get(`/inscription/${id}`);
    return reponse;
}