import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import MRTIndex from './mrt-index';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomeIndex from './home/homeIndex';
import Navigation from './navigation/navigation';
import AdminPage from './admin/adminPage';
import StationIndex from './stations/station-index';
import Stations from './stations/station-index';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
      path: "/",
      element: <MRTIndex/>
  }, 
  {
      path: "/admin",
      element: <AdminPage/>
  },
  {
      path: "/stations",
      element: <Stations/>
  },
  {
      path: "/stations/lrt-1"
  },
  {
      path: "/stations/lrt-2"
  },
  {
    path: "/stations/mrt-3"
  },
])


root.render(
  <React.StrictMode>
        <Navigation/>
        <RouterProvider router = {router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
