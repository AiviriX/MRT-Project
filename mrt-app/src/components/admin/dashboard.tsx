import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <Link to="/cards/manage" className='flex-auto shrink w-64 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded'>
                Manage Cards
            </Link>
            <Link to="/setfare" className="shrink w-64 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                Manage Fare
            </Link>
            <Link to="/stations/manage" className="flex-auto shrink w-64 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                Manage Stations
            </Link>
        </div>
    );
}

export default AdminDashboard;