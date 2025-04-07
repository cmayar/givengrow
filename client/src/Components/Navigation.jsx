import { useAuth } from "./AuthContext.jsx";
import GuestNavigationBar from "./GuestNavigation";
import UserNavigationBar from "./UserNavigation";
import React from "react";

export const NavigationBar = () => {
    const authProvider = useAuth(); //changed isSignedIn to authProvider
 
    return authProvider.isSignedIn ? (
        <UserNavigationBar />
    ) : (
        <GuestNavigationBar />
    );
};

export default NavigationBar;
