import { useAuth } from "./AuthContext.jsx";
import GuestNavigationBar from "./GuestNavigation";
import UserNavigationBar from "./UserNavigation";
import React from "react";

export const NavigationBar = () => {
    let authProvider = useAuth(); //was isSignedIn
    return authProvider ? (
        <UserNavigationBar />
    ) : (
        <GuestNavigationBar />
    );
};

export default NavigationBar;




