import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  // checking localStorage to restore sign-in state
  useEffect(() => {
    const storedStatus = localStorage.getItem("isSignedIn");
    if (storedStatus === "true") {
      setIsSignedIn(true);
    }
  }, []);

  // Whenever isSignedIn changes, update localStorage
  useEffect(() => {
    localStorage.setItem("isSignedIn", isSignedIn);
  }, [isSignedIn]);

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
