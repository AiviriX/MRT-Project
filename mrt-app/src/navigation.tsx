import './style/mrt_index.css'
import './style/nav.css'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { removeSessionToken, hasSessionToken } from './auth/sessionTokenManager'

export const Navigation = () => {
    const [hasToken, setToken] = useState(hasSessionToken())
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    //Handles the instructions to remove the session token locally....
    const locRemoveSessionToken = () => {
        removeSessionToken();
        setToken(hasSessionToken());
    }

    return (   
        <nav className=''>
            <ul className="">
                <div className='flex justify-items-start'>
                <li className=''>
                    <Link className="flex mx-10 text-[#fff] font-bold " to="/">MRT TMS</Link>
                </li>
                </div>
                <div className='nav-list'>
                <li className='nav-item'>
                    <a className="nav-link" onClick={toggleDropdown}>Menu</a>
                    {showDropdown && (
                        <div className="dropdown">
                            <ul>
                                <li>
                                    {hasToken ? (
                                        <Link className="nav-link" to="/admin/control">Admin Control</Link>
                                    ) : (
                                        <Link className="" to="/login/admin">Login</Link>
                                    )}
                                </li>
                                {hasToken && (
                                    <li onClick={locRemoveSessionToken}>
                                        <Link className="nav-link" to='/'>Logout</Link>
                                    </li>
                                )}
                            </ul>
                            
                        </div>
                    )}
                </li>
                </div>
            </ul>
        </nav>
    );
}

export default Navigation
