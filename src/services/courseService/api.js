import { axiosPrivate } from "api/axios";

export const getAllCourses = async (id) => {
    const reponse = await axiosPrivate.get(`/course/all`);
    return reponse;
}