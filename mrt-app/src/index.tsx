import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


import './index.css';
import reportWebVitals from './reportWebVitals';
import MRTIndex from './homepage';
import Navigation from './navigation';
import AdminControl from './components/admin/controlPanel';
import StationIndex from './components/stations';
import MRT3Stations from './components/stations/mrt3-stations';
import AdminLogin from './components/admin/login';
import CardManager from './components/cards/manager';
import Fare from './components/stations/fare';
import NoAccess from './noAccess';
import StationModal from './components/stations/crud/stationModal';

export const API_URL = 'http://localhost:5000';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <BrowserRouter>
        <Navigation/>
        <Routes>
          <Route path="/" element={ <MRTIndex /> } />
          <Route path="/admin/control" element={ <AdminControl /> } />
          <Route path="/register/admin" />
          <Route path="/stations" element={ <StationIndex />} />
          <Route path="/stations/mrt3" element={ <MRT3Stations />} />
          <Route path="/stations/fares" element={ <Fare/> } />
          <Route path="/login/admin" element={ <AdminLogin />} />
          <Route path="/cards/manage" element={ <CardManager/> } />
          <Route path="/noaccess" element={<NoAccess/>} />
          <Route path="/setfare" element={ <Fare/> } />
          <Route path="*" element={ <h1> 404 Not Found </h1> } />
          <Route path="/test" element={ <StationModal isOpen={true} onRequestClose={()=>null} mode='create'/> } />
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
