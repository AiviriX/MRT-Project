import React from 'react';
import NavigationUser from './navigation/navigation';
import AdminPage from './admin/adminPage';

import mrt from './res/mrt.jpg'
import station from './res/station.jpg'

import './index.css'
import './style/mrt_index.css'
import './style/nav.css'

const MRTIndex = () => {
    return (
        <div> 
            <div className="bg-black">
                <NavigationUser/>
            </div>
                <div>
                    <AdminPage/>
                </div>
            <div className='bg-purple-600'> 
            </div>
            {/* <img className='background_img' src = {station} alt=''/>  */}
        </div>
    );
}

export default MRTIndex;