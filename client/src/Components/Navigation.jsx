import { useAuth } from "./AuthContext.jsx";
import GuestNavigationBar from "./GuestNavigation";
import UserNavigationBar from "./UserNavigation";
import React from "react";

const NavigationBar = () => {
    const { isSignedIn } = useAuth(); 
    return isSignedIn ? (
        <UserNavigationBar />
    ) : (
        <GuestNavigationBar />
    );
};

export default NavigationBar;




