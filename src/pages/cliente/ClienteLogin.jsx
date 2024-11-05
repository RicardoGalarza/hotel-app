// src/components/LoginAdmin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClienteLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // Ejemplo de login en React
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Llamada al endpoint de autenticación (primer endpoint)
      const response = await fetch('http://localhost:8080/cuentas/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: username,
          clave: password,
        }),
      });
    
      if (!response.ok) {
        // Verificar el estado de la respuesta para manejar diferentes errores
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Su correo y/o contraseña no son correctas');
        return; // Terminar ejecución si hay un error
      }

      console.log(response);
      
    
      const data = await response.json();
      console.log(data.userId); 
    
      // Guardar ID de usuario en localStorage      
      localStorage.setItem('userId', data.userId);
    
      // Llamada para obtener los permisos del usuario
      const userResponse = await fetch(`http://localhost:8080/cuentas/${data.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      if (!userResponse.ok) {
        const userError = await userResponse.json();
        setErrorMessage('Error al obtener los permisos del usuario');
        return;
      }
    
      const userData = await userResponse.json();
    
      // Guardar los permisos en localStorage o manejarlo en estado
      localStorage.setItem('permissions', JSON.stringify(userData.rol.permisos));
    
      // Redirigir a la página principal o dashboard

      
      if(userData.rol.id == 1){
        window.location.href = '/administracion';
      }else{
        window.location.href = '/';
      }

    } catch (error) {
      console.error('Error al autenticar:', error);
      setErrorMessage('Ocurrió un error, por favor intenta de nuevo más tarde.');
    }
  }

  return (
    <div className="container mt-5">
      <h2>Inicio de sesión</h2>
      {/* Mostrar alerta de error si existe un mensaje de error */}
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Correo electronico</label>
          <input
            type="email"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default ClienteLogin;
