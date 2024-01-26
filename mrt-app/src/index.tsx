import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, createBrowserRouter } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import MRTIndex from './homepage';
import Navigation from './navigation';
import AdminDashboard from './components/admin/dashboard';
import StationIndex from './components/stations';
import MRT3Stations from './components/stations/mrt3/mrt3-stations';
import AdminLogin from './components/admin/manager';
import CardManager from './components/cards/manager';
import Fare from './components/stations/fare';
import AuthProvider from './auth/auth-context';
import NoAccess from './noAccess';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <BrowserRouter>
        <Navigation/>
        <Routes>
          <Route path="/" element={ <MRTIndex /> } />
          <Route path="/admin/dashboard" element={ <AdminDashboard /> } />
          <Route path="/register/admin" />
          <Route path="/stations" element={ <StationIndex />} />
          <Route path="/stations/manage" element={ <StationIndex />} />
          <Route path="/stations/fares" element={ <Fare/> } />
          <Route path="/login/admin" element={ <AdminLogin />} />
          <Route path="/cards/manage" element={ <CardManager/> } />
          <Route path="/noaccess" element={<NoAccess/>} />
          <Route path="/setfare" element={ <Fare/> } />
          <Route path="*" element={ <h1> 404 Not Found </h1> } />
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
