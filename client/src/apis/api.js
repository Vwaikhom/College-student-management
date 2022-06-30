import axios from 'axios';

const BASE_URL = 'http://localhost:3001';


const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': localStorage.getItem("token")
    }
})

export default instance;
