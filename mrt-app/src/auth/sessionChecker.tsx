import { Component } from "react";
import AdminDashboard from "../admin/dashboard";

export const SessionChecker = (component: Component) => {
    return (props: any) => {
        
        if (localStorage.getItem('token') === null){

        } else {
            //Continue whatever u r doing with the protected component
        }
    }
}

export const getSessionToken = () => {
    if (localStorage.getItem('token') === null){
        return false;
    } else {
        console.log(localStorage.getItem('token'))
        return true;
    }
}

export const removeSession = () => {
    if (getSessionToken()){
        localStorage.removeItem('token');
        return true;
    } else {
        localStorage.removeItem('token');
        return true;
    }
}

export default SessionChecker;