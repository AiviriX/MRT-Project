import React, { useState } from 'react';
import { hasSessionToken } from '../../auth/sessionTokenManager';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@uidotdev/usehooks';
import CardManager from '../cards/manager';
import Fare from '../stations/fare';
import StationsManager from '../stations/manager';
import { TappingManager } from '../tapping/manager';

const AdminControl = () => {
    const [hasToken] = useState(hasSessionToken());
    const [showSidebar, setShowSidebar] = useState(false);
    const [action, setAction] = useState('');
    const navigate = useNavigate();
    const isLargeScreen = useMediaQuery('(min-width: 768px)');

    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const renderAction = () => {
        switch (action) {
            case 'cards':
                return <CardManager />;
            case 'fare':
                return <Fare />;
            case 'stations':
                return <StationsManager />;
            case 'tapping':
                return <TappingManager />;
            default:
                return null;
        }
    };

    return (
        <>
            {hasToken ? (
                <div className="relative">
                    {/* Sidebar menu */}
                    <aside
                        className={`absolute top-0 left-0 border-blue border-solid border-2 z-49 ${
                            (isLargeScreen || showSidebar) ? 'translate-x-0' : '-translate-x-full'
                        } md:translate-x-0 transform transition-transform duration-300 md:transform-none flex flex-col w-64 h-screen bg-gray-800 text-white p-6 space-y-6`}
                    >
                        <h1
                            className="text-xl font-bold cursor-pointer"
                            onClick={() => {
                                handleToggleSidebar();
                                setShowSidebar(true);
                            }}
                        >
                            Admin Control
                        </h1>
                        <button
                            onClick={() => {
                                setAction('cards');
                                setShowSidebar(false);
                            }}
                            className="w-full bg-black-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Manage Cards
                        </button>
                        <button
                            onClick={() => {
                                setAction('fare');
                                setShowSidebar(false);
                            }}
                            className="w-full bg-black-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Manage Fare
                        </button>
                        <button
                            onClick={() => {
                                setAction('stations');
                                setShowSidebar(false);
                            }}
                            className="w-full bg-black-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Manage Stations
                        </button>
                        <button
                            onClick={() => {
                                setAction('tapping');
                                setShowSidebar(false);
                            }}
                            className="w-full bg-black-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Tapping
                        </button>
                    </aside>

                    {/* Main content */}
                    <main className={`${(isLargeScreen || showSidebar) ? 'md:ml-64' : ''} overflow-auto h-screen`}>
                        {renderAction()}
                    </main>

                    {/* Hamburger menu */}
                    <button
                        onClick={handleToggleSidebar}
                        className="fixed bottom-4 left-4 z-50 text-white bg-black rounded-full focus:outline-none p-2 md:hidden md:z-50"
                    >
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>
            ) : (
                <>
                    {alert('You Do Not Have Access To This Page')}
                    {navigate('/login/admin')}
                </>
            )}
        </>
    );
};

export default AdminControl;
