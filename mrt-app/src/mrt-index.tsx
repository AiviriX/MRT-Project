import React from 'react';
import NavigationUser from './navigation/navigation';
import AdminPage from './admin/adminPage';
import HomeIndex from './home/homeIndex';

import mrt from './res/station.jpg'
import station from './res/station.jpg'



const MRTIndex = () => {
    return (
        <div> 
            <div className="vignette w-full h-full">
                <img src={mrt} alt="MRT"/>
            </div>
        </div>
    );
}

export default MRTIndex;