import React from 'react';
import { Navigate } from 'react-router-dom';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem('userId'); // Verifica si el usuario está logueado
  return userId ? children : <Navigate to="/login" />; // Si no está logueado, redirige a login
};

export default ProtectedRoute;