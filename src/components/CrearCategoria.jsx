import axios from 'axios';
import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CrearCategoria = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState(null); // Estado para el archivo de imagen
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        if (imagen) {
            formData.append('imagen', imagen);
        }

        try {
            // Envía la categoría a tu API para guardarla
            await axios.post('http://localhost:8080/categorias', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Mostrar la alerta de éxito
            setMostrarAlerta(true);

            // Navegar de vuelta a la página de administración después de un tiempo
            setTimeout(() => {
                setMostrarAlerta(false);
                navigate('/admin/ver-categorias');
            }, 3000); // Espera 3 segundos antes de redirigir
        } catch (error) {
            console.error('Hubo un error al crear la categoría:', error);
            alert('No se pudo crear la categoría');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Crear Categoría</h2>

            {mostrarAlerta && (
                <Alert variant="success" onClose={() => setMostrarAlerta(false)} dismissible>
                    Categoría creada con éxito
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <input
                        type="text"
                        className="form-control"
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="imagen" className="form-label">Imagen</label>
                    <input
                        type="file"
                        className="form-control"
                        id="imagen"
                        onChange={(e) => setImagen(e.target.files[0])}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Crear Categoría</button>
            </form>
        </div>
    );
};

export default CrearCategoria;
