//admin/manager.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { hasSessionToken } from '../../auth/sessionTokenManager';
const urlEndpoint = process.env.SECRET_KEY;
console.log(urlEndpoint)

export const AdminLogin = () => {
    const navigate = useNavigate();    

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hasToken, setToken] = useState(hasSessionToken())


    // const {isLoggedIn, setLoggedIn} = useAuth();

    const handleButtonChange = () => {
        setToken(hasSessionToken())
        navigate('/admin/control')
    }

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
                    handleButtonChange()
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
        <div className=' flex justify-center items-start min-h-screen h-full bg-black pt-20'>
            <div className='w-full max-w-md p-4 bg-white shadow rounded-lg z-10'>
                <h1 className='text-center mb-4'>Admin Login</h1>
                <input
                    className='mb-2 w-full px-3 py-2 border rounded'
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className='mb-4 w-full px-3 py-2 border rounded'
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className='flex flex-col md:flex-row md:justify-between'>
                    <button
                        className='w-full md:w-auto px-4 py-2 mb-2 md:mb-0 bg-green-500 text-white rounded focus:outline-none focus:bg-green-600'
                        onClick={handleRegister}
                    >
                        Sign Up
                    </button>
                    <button
                        className='w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded focus:outline-none focus:bg-blue-600'
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;