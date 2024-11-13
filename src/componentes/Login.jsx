import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import './Navbar.css';
export const LoginButton=()=>{
    const{loginWithRedirect}=useAuth0();
    return<button className="Cabecera-link" onClick={()=>loginWithRedirect()}> Login </button>
}