import { Component } from "react";

export const hasSession = (component: Component) => {
    return (props: any) => {
        
        if (localStorage.getItem('token') === null){
            return false;
        } else {
            return true;
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

export const removeSessionToken = () => {
    if (hasSessionToken()){
        localStorage.removeItem('token');
        return true;
    } else {
        localStorage.removeItem('token');
        return true;
    }
}

export default hasSession;