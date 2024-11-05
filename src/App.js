
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';


import ConfirmarReserva from './components/ConfirmarReserva';
import CrearCaracteristica from './components/CrearCaracteristica';
import CrearCategoria from './components/CrearCategoria';
import CrearCuentaAdmin from './components/CrearCuentaAdmin';
import CrearCuentaCliente from './components/CrearCuentaCliente';
import EditarCategoria from './components/EditarCategoria';
import EditarHabitacion from './components/EditarHabitacion';
import Favoritos from './components/Favoritos';
import FooterAdmin from './components/FooterAdmin';
import FooterCliente from './components/FooterCliente';
import GaleriaCompleta from './components/GaleriaCompleta ';
import HeaderAdmin from './components/HeaderAdmin';
import HeaderCliente from './components/HeaderCliente';
import InformacionPersonal from './components/InformacionPersonal';
import ListarCaracteristicas from './components/ListarCaracteristicas';
import ListarCuentas from './components/ListarCuentas';
import VerCategorias from './components/VerCategorias';
import VerHabitacion from './components/VerHabitacion';
import Administrador from './pages/administrador/Administrador';
import RegistrarHabitacion from './pages/administrador/RegistrarHabitacion';
import ClienteLogin from './pages/cliente/ClienteLogin';
import HistorialReservas from './pages/cliente/HistorialReservas';
import VerDetalles from './pages/cliente/VerDetalles';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProtectedRoute from './routes/ProtectedRoute';
import './styles/_custom.scss';




function App() {
  const location = useLocation();

  const renderHeader = () => {
    /*
    if (location.pathname.startsWith('/admin')) {
      return <HeaderAdmin />;
    }
    if (location.pathname === '/login') {
      return <HeaderLoginCliente />;
    }
    if (location.pathname === '/loginadmin') {
      return <HeaderLoginAdmin />;
    }
    return <HeaderCliente />;
    */

    if (location.pathname.startsWith('/admin')) {
      return <HeaderAdmin />;
    }
    return <HeaderCliente />;
  };

  const renderFooter = () => {
    if (location.pathname.startsWith('/admin')) {
      return <FooterAdmin />;
    }
    return <FooterCliente />;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {renderHeader()}
      <main className="flex-grow-1">
        <div className="container mt-5">
          <Routes>
            <Route path="/admin/crear-cuenta" element={<CrearCuentaAdmin />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<ClienteLogin />} />
            <Route path="/verdetalles/:id" element={<VerDetalles />} />
            <Route path="/galeria-completa/:id" element={<GaleriaCompleta />} />
            <Route path="/habitaciones/:id" element={<VerDetalles />} />
            <Route path="/crearcuentacliente" element={<CrearCuentaCliente />} />
            <Route path="/administracion" element={<Administrador />} />
            <Route path="/admin/crear-categoria" element={<CrearCategoria />} />
            <Route path="/admin/ver-categorias" element={<VerCategorias />} />
            <Route path="/admin/editar-habitacion/:id" element={<EditarHabitacion />} />
            <Route path="/admin/editar-categoria/:id" element={<EditarCategoria />} />

            <Route path="/InformacionPersonal" element={<InformacionPersonal />} />
            <Route path="/admin/listar-cuentas" element={<ListarCuentas />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/historial" element={<HistorialReservas />} />

            

            {/* Otras rutas */}
            <Route path="*" element={<NotFound />} />
            <Route path="/reserva/confirmar" element={<ConfirmarReserva />} />


            {/* Rutas protegidas */}
            <Route path="/admin/crearhabitacion" element={<ProtectedRoute><RegistrarHabitacion /></ProtectedRoute>} />
            <Route path="/admin/verhabitacion" element={<ProtectedRoute><VerHabitacion /></ProtectedRoute>} />
            <Route path="/admin/crear-categoria" element={<ProtectedRoute><CrearCategoria /></ProtectedRoute>} />
            <Route path="/admin/ver-categorias" element={<ProtectedRoute><VerCategorias /></ProtectedRoute>} />
            <Route path="/admin/ver-caracteristicas" element={<ProtectedRoute><ListarCaracteristicas /></ProtectedRoute>} />
            <Route path="/admin/crear-caracteristica" element={<ProtectedRoute><CrearCaracteristica /></ProtectedRoute>
            }
            />
          </Routes>
        </div>
      </main>
      {renderFooter()}
    </div>
  );
}

export default App;
