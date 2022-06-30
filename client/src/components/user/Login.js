import React from 'react';
import { useRef, useState, useEffect } from "react";
import useAuth from '../../hooks/useAth';
import axios from 'axios';

const Login = () => {
    const { setAuth } = useAuth();
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

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
            setAuth({user});
            localStorage.setItem("token", response.data.token);
            setUser('');
            setPwd('');
            setSuccess(true);
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
        <>
            {success ? (
                <section>
                    <h1>You are logged in</h1>
                    <br />
                    <p>
                        <a href="/">Go to Home</a>
                    </p>
                </section>
            )
                :( 
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
            )}
        </>
        );
}
 
export default Login;