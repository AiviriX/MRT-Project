import { Component } from "react";
import { useAuth } from "./auth-context";
// import { useAuth } from "./auth-context";


export const SessionChecker = (component: Component) => {
    return (props: any) => {
        
        if (localStorage.getItem('token') === null){

        } else {
            //Continue whatever u r doing with the protected component
        }
    }
}

export const hasSessionToken = () => {
    if (localStorage.getItem('token') === null){
        return false;
    } else {
        return true;
    }
}

//Removes the session token and logs out the user as well.
export const removeSessionToken = () => {
    if (hasSessionToken()){
        localStorage.removeItem('token');
    } 
}

export default SessionChecker;