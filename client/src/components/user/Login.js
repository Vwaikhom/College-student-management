import React from 'react';
import { useRef, useState, useEffect } from "react";
import useAuth from '../../hooks/useAuth';
import axios from '../../apis/api';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const { setAuth,persist, setPersist } = useAuth();
    const userRef = useRef();
    const errRef = useRef();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user,pwd]);

    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            const response = await axios.post('/login', JSON.stringify({user,pwd}), 
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            const role = response?.data?.role;
            const accessToken = response?.data?.accessToken;
            setAuth({user,role,accessToken});
            //localStorage.setItem("token", response.data.token);
            setUser('');
            setPwd('');
            navigate(from, {replace: true});
        }
        catch (err){
            if(!err?.response){
                setErrMsg('No Server Response')
            } else if(err.response?.status === 400){
                setErrMsg('Missing username or password')
            } else if(err.response?.status === 401){
                setErrMsg('Unauthorized');
            } else{
                setErrMsg('Login Failed');
            }

            errRef.current.focus();
        }
    }
    return ( 
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" :
                "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="userName">UserName:</label>
                    <input 
                        type="text" 
                        id="userName" 
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />
                    <button>Sign In</button>
                </form>
        </section>
    );
}
 
export default Login;