import axios from '../api/axios';
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken } from "../state";

const useRefreshToken = () => {
    const dispatch = useDispatch();
    

    const refresh = async (refreshTokenState) => {
        const response = await axios.post('/auth/refresh-token', {
            refreshToken: refreshTokenState
          }, {
            withCredentials: true
        });
        dispatch(setAccessToken({ accessToken: response.data.accessToken }));
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;