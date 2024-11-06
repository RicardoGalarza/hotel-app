import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';

const CrearCaracteristica = () => {
  const [nombre, setNombre] = useState('');
  const [imagen, setImagen] = useState(null);
  const [alerta, setAlerta] = useState({ visible: false, mensaje: '', tipo: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', nombre);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      // Llamada a la API para crear la característica
      await axios.post(`${process.env.REACT_APP_API_URL}/caracteristicas`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAlerta({ visible: true, mensaje: 'Característica creada con éxito', tipo: 'success' });
      setNombre('');
      setImagen(null);
    } catch (error) {
      console.error('Error al crear la característica:', error);
      setAlerta({ visible: true, mensaje: 'Hubo un error al crear la característica', tipo: 'danger' });
    }
  };

  const handleImagenChange = (e) => {
    setImagen(e.target.files[0]);
  };

  return (
    <Container className="mt-5">
      <h2>Crear Característica</h2>

      {alerta.visible && (
        <Alert variant={alerta.tipo} className="mt-3" onClose={() => setAlerta({ visible: false })} dismissible>
          {alerta.mensaje}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="imagen">
          <Form.Label>Imagen</Form.Label>
          <Form.Control type="file" onChange={handleImagenChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Crear Característica
        </Button>
      </Form>
    </Container>
  );
};

export default CrearCaracteristica;
