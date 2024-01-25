import { Component } from "react";
import AdminDashboard from "../components/admin/dashboard";

export const hasSession = (component: Component) => {
    return (props: any) => {
        
        if (localStorage.getItem('token') === null){
            return false;
        } else {
            return true;
        }
    }
}

export const getSessionToken = () => {
    if (localStorage.getItem('token') === null){
        return false;
    } else {
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

export default hasSession;