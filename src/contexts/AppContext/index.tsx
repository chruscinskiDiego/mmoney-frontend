import { createContext, useState, useEffect } from "react";
import { AuthService } from "../../services/AuthService";
import Cookies from "js-cookie";

interface IAppContext {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    user: string | undefined;
    setUser: (value:string) => void;
}

export const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppContextProvider = ({ children }: any) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<string | undefined>('');
    
    const userEmail = Cookies.get('user');

    useEffect(() => {
        const authenticated = AuthService.isAuthenticated();
        setIsLoggedIn(authenticated);
    }, []);

    useEffect(() => {
        setUser(userEmail);
    },[userEmail]);

    return (
        <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser}}>
            {children}
        </AppContext.Provider>
    );
};