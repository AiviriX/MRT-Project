import '../style/mrt_index.css'
import '../style/nav.css'
import mrt from '../public/mrt.jpg'
import { useState } from 'react'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomeIndex from '../home/homeIndex'

export const Navigation = () => {
    return (   
      <nav className='bg-white border-gray-200 dark:bg-gray-900 sticky top-0 z-10'>
      <ul className=''>
          <li className=''> <a href="/" className=''> MRT/LRT Train Management System</a></li>
          <li className='right'> <a href='stations'> Sign Up </a> </li>
          <li className='right'> <a href=''> Login </a> </li>
          <li className='right'> <a href="#"> About Us </a> </li>
          <li className='right'> <a > Contact </a> </li>
          <li className='right'> <a type="button"> News </a> </li>
          <li className='right'> <a href='stations'> Stations </a> </li>
      </ul>
  </nav>
    );
}
export default Navigation