import React from 'react';
import Navigation from './navigation'
import mrt from './res/mrt.jpg'

import './style/mrt_index.css'
import './style/nav.css'

const MRTIndex = () => {
    return (
        <div> 
            <Navigation/>
            <img className='background_img' src = {mrt} alt=''/> 
        </div>
    );
}

export default MRTIndex;