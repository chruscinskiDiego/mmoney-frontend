import axios from "axios";
import Cookies from "js-cookie"

export const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_ADDRESS,
    timeout: 5000,
});

api.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});