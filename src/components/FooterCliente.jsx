import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

const FooterCliente = () => {
  return (
    <footer className="bg-light py-3 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 d-flex align-items-center">
            <img
              src="https://img.freepik.com/vector-premium/logo-diseno-hotel_423075-16.jpg"
              alt="Logo de la empresa"
              className="rounded-circle"
              style={{ height: '40px', width: '40px', marginRight: '10px' }}
            />
            <p className="mb-0">© 2024 Hotel Ricardo. Todos los derechos reservados.</p>
          </div>
          <div className="col-md-6 text-md-end mt-3 mt-md-0">
            <p className="mb-0">Dirección de la empresa o información adicional</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterCliente;
