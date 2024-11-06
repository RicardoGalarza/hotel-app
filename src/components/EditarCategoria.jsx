import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const EditarCategoria = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categoria, setCategoria] = useState({ nombre: '', descripcion: '' });
    const [alerta, setAlerta] = useState({ visible: false, mensaje: '', tipo: '' });

    useEffect(() => {
        // Cargar los datos de la habitación cuando se monta el componente
        axios.get(`${process.env.REACT_APP_API_URL}/categorias/${id}`)
            .then(response => {
                setCategoria(response.data);
            })
            .catch(error => {
                console.error('Error al cargar la categoria:', error);
            });
    }, [id]);

    const handleChange = (e) => {
        setCategoria({
            ...categoria,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`${process.env.REACT_APP_API_URL}/categorias/${id}`, categoria)
            .then(() => {
                setAlerta({ visible: true, mensaje: 'Cambios guardados con éxito', tipo: 'success' });
                setTimeout(() => {
                    setAlerta({ visible: false });
                    navigate('/admin/ver-categorias'); 
                }, 2000);
            })
            .catch(error => {
                setAlerta({ visible: true, mensaje: 'Error al guardar los cambios', tipo: 'danger' });
                console.error('Error al actualizar la categoria:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h2>Editar Categoría</h2>

            {/* Mostrar alerta solo si está visible */}
            {alerta.visible && (
                <Alert variant={alerta.tipo} onClose={() => setAlerta({ ...alerta, visible: false })} dismissible>
                    {alerta.mensaje}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={categoria.nombre}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <input
                        type="text"
                        className="form-control"
                        name="descripcion"
                        value={categoria.descripcion}
                        onChange={handleChange}
                    />
                </div>
                
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default EditarCategoria;
