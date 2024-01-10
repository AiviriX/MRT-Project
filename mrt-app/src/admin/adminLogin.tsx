import React from 'react'
import StationImage from '../mrt-index';

const loginAdmin = () => {

}

export const AdminLogin = () => {

    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')

    const handleLogin = async () => {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password}),
    });

    const data = await response.json();
    if (response.ok){
        alert('Login Successful')
    } else {
        alert('Login Failed')
    }

    }
    return (
        <div className='flex justify-center items-center h-screen bg-black'>
            <div className='w-64 p-4 bg-white shadow rounded z-10'>
                <h1 className='mb-4'>Admin Login</h1>
                <input className='mb-2 w-full p-2 border rounded' type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className='mb-4 w-full p-2 border rounded' type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className='flex justify-between'>
                    <button className='p-2 bg-green-500 text-white rounded'>Sign Up</button>
                    <button className='p-2 bg-blue-500 text-white rounded' onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;