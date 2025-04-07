import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    
//add console logs to help w/ debugging???
return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
        {children}  
        </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);