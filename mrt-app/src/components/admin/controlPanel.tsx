//admin/control.tsx
import React, { useEffect, useState } from 'react';
import { hasSessionToken } from '../../auth/sessionTokenManager';
import { useNavigate } from 'react-router-dom';
import CardManager from '../cards/manager';
import Fare from '../stations/fare';
import StationsManager from '../stations/manager';
import { TappingManager } from '../tapping/manager';

const AdminDashboard = () => {
    const [hasToken, setToken] = useState(hasSessionToken())
    const [action, setAction] = useState(String)
    const navigate = useNavigate();

    const renderAction = () => {
        if (action === 'cards') {
          return <CardManager/>;
        }
    
        if (action === 'fare') {
          return <Fare/>
        }

        if (action === 'stations') {
            return <StationsManager/>
        }

        if (action === 'tapping') {
            return <TappingManager/>
        }
    };

    useEffect(() => {
       renderAction()
    }, [action])

    return (
        <>
        {
            hasToken ? (
                <div className="flex justify-bet h-screen overflow-x">
                    <aside className="flex flex-col w-1/8  items-center h-screen bg-gray-800 text-white p-6 space-y-6">
                    <h1 className="text-xl font-bold cursor-pointer" onClick={()=>setAction('overview')}>Admin Control</h1>
                        <button 
                            onClick={()=>setAction('cards')}
                            className='shrink w-full bg-black-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded'>
                                 Manage Cards
                        </button>
                        <button 
                            onClick={()=>setAction('fare')}
                            className='shrink w-full bg-black-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded'>
                                 Manage Fare
                        </button>
                        <button 
                            onClick={()=>setAction('stations')}
                            className='shrink w-full bg-black-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'>
                                 Manage Stations
                        </button>
                        <button 
                            onClick={()=>setAction('tapping')}
                            className='shrink w-full bg-black-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>
                                 Tapping
                        </button>
                    </aside>

                    <main className="flex-grow overflow-hidden h-screen border-2">
                           {renderAction()}
                    </main>
                </div>
            ) : (
                alert('You Do Not Have Access To This Page'),
                navigate('/login/admin')
            )
        }   
        </>

    );
}

export default AdminDashboard;