import React from 'react'
import StationImage from '../mrt-index';


export const AdminLogin = () => {
    return (
        <div className='flex justify-center items-center h-screen bg-black'>
            <div className='w-64 p-4 bg-white shadow rounded z-10'>
                <h1 className='mb-4'>Admin Login</h1>
                <input className='mb-2 w-full p-2 border rounded' type='text' placeholder='Username' />
                <input className='mb-4 w-full p-2 border rounded' type='password' placeholder='Password' />
                <div className='flex justify-between'>
                    <button className='p-2 bg-green-500 text-white rounded'>Sign Up</button>
                    <button className='p-2 bg-blue-500 text-white rounded'>Login</button>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;