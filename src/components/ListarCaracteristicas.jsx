import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Container, Table } from 'react-bootstrap';

const ListarCaracteristicas = () => {
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Llamada a la API para obtener las características
    const fetchCaracteristicas = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/caracteristicas`);
        setCaracteristicas(response.data);
      } catch (error) {
        setError('Error al obtener las características. Intenta de nuevo más tarde.');
        console.error('Error al obtener las características:', error);
      }
    };

    fetchCaracteristicas();
  }, []);

  return (
    <Container className="mt-5">
      <h2>Listado de Características</h2>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {caracteristicas.length > 0 ? (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Imagen</th>
            </tr>
          </thead>
          <tbody>
            {caracteristicas.map((caracteristica) => (
              <tr key={caracteristica.id}>
                <td>{caracteristica.id}</td>
                <td>{caracteristica.nombre}</td>
                <td>
                  {caracteristica.imagenNombre ? (
                    <img
                      src={`https://storage.googleapis.com/habitaciones/${caracteristica.imagenNombre}`}
                      alt={caracteristica.nombre}
                      style={{ width: '50px', height: 'auto' }}
                    />
                  ) : (
                    'Sin imagen'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="warning" className="mt-3">
          No hay características disponibles.
        </Alert>
      )}
    </Container>
  );
};

export default ListarCaracteristicas;
