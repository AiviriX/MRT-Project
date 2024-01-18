import React from 'react'

import { useNavigate } from 'react-router-dom';
import jwt from 'jsonwebtoken'

export const AdminLogin = () => {
    const navigate = useNavigate();
    const secret = process.env.SESSION_KEY
    const JWT_SECRET = process.env.SECRET_KEY || '';

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = async () => {
        try {

            const response = await fetch('http://localhost:5000/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password}),
            });

            const data = await response.json();
            if (response.ok){

                jwt.sign (
                    {
                        username: username,
                        password: password
                    },
                    JWT_SECRET,
                    {
                        expiresIn: '1h'
                    },
                )

                alert('Login Successful')
            } else {
                alert('Login Failed')
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