import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App.jsx';
import StartupsPage from './pages/StartupsPage.jsx';
import TechnologiesPage from './pages/TechnologiesPage.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Definimos las rutas de la aplicación
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true, // La ruta raíz (/) redirige a /startups
        element: <Navigate to="/startups" replace />
      },
      {
        path: '/startups',
        element: <StartupsPage />
      },
      {
        path: '/technologies',
        element: <TechnologiesPage />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);