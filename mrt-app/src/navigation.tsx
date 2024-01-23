import './style/mrt_index.css'
import './style/nav.css'
import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import { removeSession, getSessionToken } from './auth/sessionChecker'

export const Navigation = () => {
    const [token, setToken] = useState(getSessionToken())

    useEffect(() => {
        setToken(getSessionToken());
    }, [])

    return (   
        <nav className='shrink bg-white border-gray-200 dark:bg-gray-900 top-0 z-10 relative'>
            <ul className='z-19'>
                <li className='left'>
                    <Link className="shrink w-32" to="/">MRT TMS</Link>
                </li>

                {token ? (
                    <div>
                        <li className='flex right '>
                            <Link to='/' onClick={removeSession}> Logout </Link>
                        </li>
                        <li className='flex right'>
                            <Link to="/admin/dashboard"> Dashboard</Link>
                        </li>
                    </div>                    
                ) : (
                    <li className='flex right'>
                        <Link to="/login/admin">Login</Link>
                    </li>
                )

                }
                <li className='right'>
                    <Link to="/stations/">Stations</Link>
                </li>

            </ul>
        </nav>
    );
}
export default Navigation