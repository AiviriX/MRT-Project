import mrt from '../res/station.jpg'
import '../style/mrt_index.css'

const HomeIndex = () => {
    return(
        <div className='h-14 bg-gradient-to-r from-cyan-500 to-blue-500'>
            <div>
                {/* <img src={mrt} className='position: fixed z-0' /> */}
            </div>      
            <div className='relative z-1 x-100 y100'>
                <h1 className='text-white font-sans'> You are now at home index!</h1>
                <button className='mrtButton bg-white text-black font-sans'> Click me! </button>
            </div>  
        </div>
    );
}

export default HomeIndex;