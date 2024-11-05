import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Link } from 'react-router-dom';

const HeaderLoginCliente = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light py-3">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src="https://img.freepik.com/vector-premium/logo-diseno-hotel_423075-16.jpg"
              alt="Logo de la empresa"
              className="rounded-circle"
              style={{ height: '40px', width: '40px', marginRight: '10px' }}
            />
            <h1 className="h3 mb-0">HOTEL</h1>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/crearcuentacliente" className="btn btn-primary me-2">
                  Crear cuenta
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="btn btn-primary me-2">
                  Inicio
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderLoginCliente;
