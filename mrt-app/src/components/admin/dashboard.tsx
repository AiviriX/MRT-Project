import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { hasSessionToken } from '../../auth/sessionTokenManager';
import { useNavigate } from 'react-router-dom';
import CardManager from '../cards/manager';
import Fare from '../stations/fare';

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
            //
        }
    
        // Add more if statements here for other actions...
      };

      useEffect(() => {
        renderAction()
        }, [action])

    return (
        <>

        {
            hasToken ? (
                <div className="flex justify-bet  space-y-4">
                    <aside className="flex flex-col w-64 items-center h-screen bg-gray-800 text-white p-6 space-y-6">
                    <h1 className="text-xl font-bold cursor-pointer" onClick={()=>setAction('overview')}>Admin Control</h1>
                        <button 
                            onClick={()=>setAction('cards')}
                            className='shrink w-64 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded'>
                                 Manage Cards
                         </button>
                        <button 
                            onClick={()=>setAction('fare')}
                            className='shrink w-64 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded'>
                                 Manage Fare
                        </button>
                        <button 
                            onClick={()=>setAction('stations')}
                            className='shrink w-64 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'>
                                 Manage Stations
                        </button>

                        {/* <h1 className="text-xl font-bold">Card Management</h1>
                        <button
                            // onClick={() => setCardAction('create')}
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Create UUID
                        </button>
                        <button
                            // onClick={() => setCardAction('read')}
                            className="w-full bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Read UUID
                        </button> */}
                    </aside>

                    <main className="flex-grow p-8 overflow-auto h-screen border-8">
                        <div className=''>
                           {renderAction()}
                        </div>
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