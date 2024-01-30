//admin/manager.tsx
import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom';
import { hasSessionToken } from '../../auth/sessionTokenManager';
// import { getSessionToken } from '../../auth/sessionTokenManager';

// import AuthProvider, { useAuth } from '../../auth/auth-context';

export const AdminLogin = () => {
    const navigate = useNavigate();    

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hasToken, setToken] = useState(hasSessionToken())


    // const {isLoggedIn, setLoggedIn} = useAuth();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/login/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password}),
            });

            const data = await response.json();
            if (response.ok){
                localStorage.setItem('token', data.token);
                if (localStorage.getItem('token') === data.token){
                    alert('Login Successful')
                    navigate('/admin/dashboard')
                }
            } else {
                alert('Login Failed')
                navigate('/login/admin')
                console.log(data)
            }
        } catch (error){
            console.log(error)
        }
    }

    const handleRegister = async () => {
        try {
            const response = await fetch('http://localhost:5000/login/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password}),
            });

            const data = await response.json();
            if (response.ok){
                alert('Register Successful')
            } else {
                alert('Register Failed')
                console.log(data)
            }
        } catch (error){

        }
    }

    return (
        <div className='flex justify-center items-center h-screen bg-black'>
            <div className='w-64 p-4 bg-white shadow rounded z-10'>
                <h1 className='mb-4'>Admin Login</h1>
                <input className='mb-2 w-full p-2 border rounded' type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className='mb-4 w-full p-2 border rounded' type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className='flex justify-between'>
                    <button className='p-2 bg-green-500 text-white rounded' onClick={handleRegister}>Sign Up</button>
                    <button className='p-2 bg-blue-500 text-white rounded' onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;