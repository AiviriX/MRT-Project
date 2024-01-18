import React from 'react';
import AdminPage from './admin/dashboard';

import mrt from './res/station.jpg'
import station from './res/station.jpg'



const Homepage = () => {
    return (
        <div className="relative">
            <img src={station} alt="Background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-10">
                <h1 className='text-4xl mb-4'>Hello!</h1>
                <button className="border border-white text-white px-4 py-2 rounded bg-transparent">
                    Get Started
                </button>
            </div>
        </div>
    );
}

export default Homepage;