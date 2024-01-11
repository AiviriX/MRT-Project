import '../style/mrt_index.css'
import '../style/nav.css'
import station from '../res/station.jpg'
import { useState } from 'react'

import { Link } from 'react-router-dom'
import HomeIndex from '../home/homeIndex'

export const Navigation = () => {

    return (   
        <nav className='bg-white border-gray-200 dark:bg-gray-900 sticky top-0 z-10 relative'>
            <ul className='z-19'>
                <li className='left'>
                    <Link to="/">MRT/LRT Train Management System</Link>
                </li>
                <li className='right'>
                    <Link to="/stations/">Stations</Link>
                </li>
                <li className='right'>
                    <Link to="/login/admin">Login</Link>
                </li>
            </ul>
        </nav>
    );
}
export default Navigation