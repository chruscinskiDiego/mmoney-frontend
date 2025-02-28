import { api } from "../lib/axios";
import Cookies from "js-cookie";

export const AuthService = {
    login: (token:any) => {
        Cookies.set("token", token, { secure: true });
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },
    logout: () => {
        Cookies.remove("token");
        Cookies.remove("user");
        delete api.defaults.headers.common["Authorization"];
    },
    isAuthenticated: () => {
        const token = Cookies.get("token");
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            return true;
        }
        return false;
    },
};
