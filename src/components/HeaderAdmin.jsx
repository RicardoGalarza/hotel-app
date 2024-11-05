import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');

  useEffect(() => {
    // Función para obtener los datos del administrador desde la API
    const fetchAdminData = async () => {
      const userId = localStorage.getItem('userId'); // Obtener el userId desde el localStorage
      if (userId) {
        try {
          // Hacer la solicitud a la API para obtener los datos del admin
          const response = await fetch(`http://localhost:8080/cuentas/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setNombre(data.nombre); // Guardar nombre del admin
            setCorreo(data.correo); // Guardar correo del admin

            // Guardar los datos en localStorage para usos futuros
            localStorage.setItem('nombre', data.nombre);
            localStorage.setItem('correo', data.correo);
          } else {
            console.log('Error al obtener los datos del admin');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      }
    };

    // Llamar a la función para obtener los datos del administrador
    fetchAdminData();

    // Cargar los permisos desde el almacenamiento local
    const storedPermissions = localStorage.getItem('permissions');
    if (storedPermissions) {
      const userPermissions = JSON.parse(storedPermissions);
      setPermissions(userPermissions);
    }
  }, []);

  const handleSelect = (eventKey) => {
    if (eventKey === 'Crear Habitaciones') {
      navigate('/admin/crearhabitacion');
    } else if (eventKey === 'Ver Habitaciones') {
      navigate('/admin/verhabitacion');
    } else if (eventKey === 'crearCategoria') {
      navigate('/admin/crear-categoria');
    } else if (eventKey === 'vercategorias') {
      navigate('/admin/ver-categorias');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('permissions');
    localStorage.removeItem('userId');
    localStorage.removeItem('nombre');
    localStorage.removeItem('correo');
    localStorage.removeItem('apellido');
    navigate('/login'); // Redirige a la página de login
  };

  // Función para obtener las iniciales del nombre
  const obtenerIniciales = (nombre) => {
    if (!nombre) return 'A'; // Si no hay nombre, mostrar 'A' por defecto
    return `${nombre.charAt(0)}`.toUpperCase();
  };

  return (
    <header className="bg-dark text-white py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <h1>Admin</h1>

        <nav className="d-flex">
        {/* Botones de Cuentas */}
        {(permissions.find(p => p.nombre === 'crear cuentas') ||
          permissions.find(p => p.nombre === 'listar cuentas')) && (
          <DropdownButton
            id="dropdown-cuentas-button"
            title="Cuentas"
            variant="warning"
            className="me-2"
          >
            {/* Crear Cuenta */}
            {permissions.find(p => p.nombre === 'crear cuentas') && (
              <Dropdown.Item eventKey="/admin/crear-cuenta" onClick={() => navigate('/admin/crear-cuenta')}>
                Crear Cuenta
              </Dropdown.Item>
            )}

            {/* Listar Cuentas */}
            {permissions.find(p => p.nombre === 'listar cuentas') && (
              <Dropdown.Item eventKey="/admin/listar-cuentas" onClick={() => navigate('/admin/listar-cuentas')}>
                Listar Cuentas
              </Dropdown.Item>
            )}

          </DropdownButton>
        )}


        {(permissions.find(p => p.nombre === 'listar caracteristicas') ||
          permissions.find(p => p.nombre === 'crear caracteristica')) && (
          <DropdownButton
            id="dropdown-cuentas-button"
            title="Caracteristicas"
            variant="warning"
            className="me-2"
          >
            {/* Listar Caracteristicas */}
            {permissions.find(p => p.nombre === 'listar caracteristicas') && (
              <Dropdown.Item eventKey="/admin/ver-caracteristicas" onClick={() => navigate('/admin/ver-caracteristicas')}>
                Listar Caracteristicas
              </Dropdown.Item>
            )}
  
            {permissions.find(p => p.nombre === 'crear caracteristica') && (
              <Dropdown.Item eventKey="/admin/crear-caracteristica" onClick={() => navigate('/admin/crear-caracteristica')}>
                Crear Caracteristica
              </Dropdown.Item>
            )}

          </DropdownButton>
        )}


          {(permissions.find(p => p.nombre === 'crear habitacion') ||
            permissions.find(p => p.nombre === 'listar habitacion')) && (
              <DropdownButton
                id="dropdown-basic-button"
                title="Habitaciones"
                onSelect={handleSelect}
                variant="warning"
                className="me-2"
              >
                {permissions.find(p => p.nombre === 'crear habitacion') && (
                  <Dropdown.Item eventKey="Crear Habitaciones">Crear Habitaciones</Dropdown.Item>
                )}

                {permissions.find(p => p.nombre === 'listar habitacion') && (
                  <Dropdown.Item eventKey="Ver Habitaciones">Ver Habitaciones</Dropdown.Item>
                )}
              </DropdownButton>
            )}

          {(permissions.find(p => p.nombre === 'crear habitacion') ||
            permissions.find(p => p.nombre === 'listar habitacion')) && (
              <DropdownButton
                id="dropdown-categorias-button"
                title="Categorías"
                onSelect={handleSelect}
                variant="warning"
                className="me-2"
              >
                {permissions.find(p => p.nombre === 'crear categoria') && (
                  <Dropdown.Item eventKey="crearCategoria">Crear Categoría</Dropdown.Item>
                )}
                {permissions.find(p => p.nombre === 'listar categoria') && (
                  <Dropdown.Item eventKey="vercategorias">Listar Categorías</Dropdown.Item>
                )}
              </DropdownButton>
            )}

          {/* Avatar y menú del administrador */}
          <li className="nav-item dropdown" style={{ listStyleType: 'none' }}> {/* Asegurar que no haya puntos */}
            <button
              className="btn btn-secondary dropdown-toggle"
              id="userMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div
                className="avatar rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  fontSize: '1.25rem',
                }}
              >
                {obtenerIniciales(nombre)}
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
              <li>
                <span className="dropdown-item-text">
                  <strong>Hola, {nombre ? nombre : 'Admin'}</strong>
                </span>
                <span className="dropdown-item-text">{correo}</span>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button onClick={handleLogout} className="dropdown-item">Cerrar sesión</button>
              </li>
            </ul>
          </li>
        </nav>
      </div>
    </header>
  );
};

export default HeaderAdmin;
