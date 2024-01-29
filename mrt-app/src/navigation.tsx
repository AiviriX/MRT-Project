import './style/mrt_index.css'
import './style/nav.css'

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { removeSessionToken, hasSessionToken } from './auth/sessionTokenManager'

export const Navigation = () => {
    const [hasToken, setToken] = useState(hasSessionToken())

    useEffect(() => {
        
    }, [hasToken])

    //Handles the instructions to remove the session token locally....
    const locRemoveSessionToken = () => {
        removeSessionToken();
        setToken(hasSessionToken());
    }


    return (   
            <nav className='flex shrink bg-white border-gray-200 dark:bg-gray-900 top-0 z-10 relative'>
                <ul className='z-19 sticky list-none m-0 p-0 overflow-hidden bg-blue-900 text-gray-200 fixed w-full'>
                    <li className='left'>
                        <Link className="shrink w-32" to="/">MRT TMS</Link>
                    </li>
                    <li className='right'>
                        <Link to="/stations/mrt3">Stations</Link>
                    </li>

                    {
                    (hasToken) ? (
                        <div>
                            <li onClick={locRemoveSessionToken} className='flex right '>
                                <Link to='/'> Logout </Link>
                            </li>
                            <li className='flex right'>
                                <Link to="/admin/control"> Admin Control </Link>
                            </li>
                        </div>                    
                    ) : (
                        <li className='flex right'>
                            <Link to="/login/admin"> Login </Link>
                        </li>
                    ) }
                </ul>
            </nav>
    );
}
export default Navigation