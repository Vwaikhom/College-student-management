import axios from "../apis/api";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    //const axiosPrivate = useAxiosPrivate();

    const refresh = async() => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return { 
                ...prev, 
                user: response.data.user,
                role: response.data.role,
                accessToken: response.data.accessToken
            }
        });
        return response.data.accessToken;
    }
    return refresh;
}

export default useRefreshToken;