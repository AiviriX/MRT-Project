import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, createBrowserRouter } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import MRTIndex from './homepage';
import Navigation from './navigation';
import AdminDashboard from './components/admin/dashboard';
import StationIndex from './stations';
import MRT3Stations from './stations/mrt3/mrt3-stations';
import AdminLogin from './components/admin/manager';
import CardManager from './components/cards/manager';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navigation/>
      <Routes>
        <Route path="/" element={ <MRTIndex />} />
        <Route path="/admin/dashboard" element={ <AdminDashboard /> } />
        <Route path="/register/admin" />
        <Route path="/stations" element={ <StationIndex />} />
        <Route path="/stations/lrt1" />
        <Route path="/stations/lrt2" />
        <Route path="/stations/mrt3" element={ <MRT3Stations />} />
        <Route path="/login/admin" element={ <AdminLogin />} />
        <Route path="/cards/manage" element={ <CardManager/> } />
        <Route path="*" element={ <h1> 404 Not Found </h1> } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
