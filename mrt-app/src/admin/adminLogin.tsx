import React from 'react'
import StationImage from '../mrt-index';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcrypt'

export const AdminLogin = () => {
    const navigate = useNavigate();

    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')

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
                alert('Login Successful')
                navigate('/adminPage')
            } else {
                alert('Login Failed')
                console.log(data)
            }
        } catch (error){
            
        }
    }

    const handleRegister = async () => {
        try {
            //Password hashing
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);


            const response = await fetch('http://localhost:5000/register/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password: hashedPassword}),
            });

            const data = await response.json();
            if (response.ok){
                alert('Registration Successful')
                navigate('/adminPage')
            } else {
                alert('Registration Failed')
                console.log(data)
            }
        } catch (error){
            console.error(error);
        }
    }



    return (
        <div className='flex justify-center items-center h-screen bg-black'>
            <div className='w-64 p-4 bg-white shadow rounded z-10'>
                <h1 className='mb-4'>Admin Login</h1>
                <input className='mb-2 w-full p-2 border rounded' type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className='mb-4 w-full p-2 border rounded' type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className='flex justify-between'>
                    <button className='p-2 bg-green-500 text-white rounded' onClick={handleRegister} >Sign Up</button>
                    <button className='p-2 bg-blue-500 text-white rounded' onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;