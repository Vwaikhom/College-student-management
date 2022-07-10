import { Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth,persist } = useAuth();

    useEffect(() => {
        let isMounted = true;
        const verifyToken = async () => {
            try{
               await refresh();
            } catch(err){
                console.log(err);
            } 
            finally{
                isMounted && setIsLoading(false);
            }
        }

        !auth?.accessToken ? verifyToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [])

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`);
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
    },[isLoading]);

    return(
        <>
            {isLoading
                ? <p>Loading...</p>
                :<Outlet />
            }
        </>
    );
}
export default PersistLogin;