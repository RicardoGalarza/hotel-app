import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

const EditarHabitacion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [habitacion, setHabitacion] = useState({
        nombre: '',
        descripcion: '',
        precio: 0,
        whatsapp: '',
        ciudad: null,
        huespedesAdultos: 0,
        huespedesNinos: 0,
        categoriasSeleccionadas: [],
        politicasSeleccionadas: [],
        imagenes: null
    });
    const [categorias, setCategorias] = useState([]);
    const [politicas, setPoliticas] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [caracteristicas, setCaracteristicas] = useState([]);
    const [caracteristicasSeleccionadas, setCaracteristicasSeleccionadas] = useState([]);
    const [imagenesPrecargadas, setImagenesPrecargadas] = useState([]);
    const [alerta, setAlerta] = useState({ visible: false, mensaje: '', tipo: '' });

    useEffect(() => {
        // Cargar los datos de la habitación
        axios.get(`${process.env.REACT_APP_API_URL}/habitaciones/${id}`)
            .then(response => {
                const habitacionData = response.data;
                setHabitacion({
                    ...habitacionData,
                    categoriasSeleccionadas: habitacionData.categorias.map(cat => ({ value: cat.id, label: cat.nombre })),
                    politicasSeleccionadas: habitacionData.politicas.map(pol => ({ value: pol.id, label: pol.titulo })),
                    ciudad: { value: habitacionData.ciudad.id, label: habitacionData.ciudad.nombre }
                });
                setImagenesPrecargadas(habitacionData.imagenes);
                setCaracteristicasSeleccionadas(habitacionData.caracteristicas.map(carac => ({ value: carac.id, label: carac.nombre })));
            })
            .catch(error => {
                console.error('Error al cargar la habitación:', error);
            });

        // Cargar categorías
        axios.get(`${process.env.REACT_APP_API_URL}/categorias`)
            .then(response => {
                setCategorias(response.data.map(cat => ({ value: cat.id, label: cat.nombre })));
            })
            .catch(error => {
                console.error('Error al cargar las categorías:', error);
            });

        // Cargar políticas
        axios.get(`${process.env.REACT_APP_API_URL}/politicas`)
            .then(response => {
                setPoliticas(response.data.map(pol => ({ value: pol.id, label: pol.titulo })));
            })
            .catch(error => {
                console.error('Error al cargar las políticas:', error);
            });

        // Cargar ciudades
        axios.get(`${process.env.REACT_APP_API_URL}/ciudades`)
            .then(response => {
                setCiudades(response.data.map(ciudad => ({ value: ciudad.id, label: ciudad.nombre })));
            })
            .catch(error => {
                console.error('Error al cargar las ciudades:', error);
            });

        // Cargar características
        axios.get(`${process.env.REACT_APP_API_URL}/caracteristicas`)
            .then(response => {
                setCaracteristicas(response.data.map(carac => ({ value: carac.id, label: carac.nombre })));
            })
            .catch(error => {
                console.error('Error al cargar las características:', error);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHabitacion({
            ...habitacion,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setHabitacion({
            ...habitacion,
            imagenes: e.target.files
        });
    };

    const handleCategoriasChange = (selectedOptions) => {
        setHabitacion({
            ...habitacion,
            categoriasSeleccionadas: selectedOptions
        });
    };

    const handlePoliticasChange = (selectedOptions) => {
        setHabitacion({
            ...habitacion,
            politicasSeleccionadas: selectedOptions
        });
    };

    const handleCiudadChange = (selectedOption) => {
        setHabitacion({
            ...habitacion,
            ciudad: selectedOption
        });
    };

    const handleCaracteristicasChange = (selectedOptions) => {
        setCaracteristicasSeleccionadas(selectedOptions);
    };

    const handleEliminarImagen = (imagenId) => {
        axios.delete(`${process.env.REACT_APP_API_URL}/imagenes/${imagenId}`)
            .then(() => {
                setImagenesPrecargadas(prevImagenes => prevImagenes.filter(img => img.id !== imagenId));
                setAlerta({
                    visible: true,
                    mensaje: 'Imagen eliminada con éxito',
                    tipo: 'success'
                });
                setTimeout(() => {
                    setAlerta({ visible: false });
                }, 2000);
            })
            .catch(error => {
                console.error('Error al eliminar la imagen:', error);
                setAlerta({
                    visible: true,
                    mensaje: 'Error al eliminar la imagen',
                    tipo: 'danger'
                });
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nombre', habitacion.nombre);
        formData.append('descripcion', habitacion.descripcion);
        formData.append('precio', habitacion.precio);
        formData.append('whatsapp', habitacion.whatsapp);
        formData.append('ciudad', habitacion.ciudad.value);
        formData.append('huespedesAdultos', habitacion.huespedesAdultos);
        formData.append('huespedesNinos', habitacion.huespedesNinos);
        formData.append('categorias', JSON.stringify(habitacion.categoriasSeleccionadas.map(cat => cat.value)));
        formData.append('politicas', JSON.stringify(habitacion.politicasSeleccionadas.map(pol => pol.value)));
        formData.append('caracteristicas', JSON.stringify(caracteristicasSeleccionadas.map(carac => carac.value)));

        if (habitacion.imagenes && habitacion.imagenes.length > 0) {
            Array.from(habitacion.imagenes).forEach(file => {
                formData.append('imagenes', file);
            });
        } else {
            formData.append('imagenes', '');
        }

        axios.put(`${process.env.REACT_APP_API_URL}/habitaciones/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                setAlerta({
                    visible: true,
                    mensaje: 'Cambios guardados con éxito',
                    tipo: 'success'
                });
                setTimeout(() => {
                    setAlerta({ visible: false });
                    navigate('/admin/verhabitacion');
                }, 2000);
            })
            .catch(error => {
                setAlerta({
                    visible: true,
                    mensaje: 'Error al guardar los cambios',
                    tipo: 'danger'
                });
                console.error('Error al actualizar la habitación:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h2>Editar Habitación</h2>

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
                        value={habitacion.nombre}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <input
                        type="text"
                        className="form-control"
                        name="descripcion"
                        value={habitacion.descripcion}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input
                        type="number"
                        className="form-control"
                        name="precio"
                        value={habitacion.precio}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <Select
                        isMulti
                        options={categorias}
                        value={habitacion.categoriasSeleccionadas}
                        onChange={handleCategoriasChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Políticas</label>
                    <Select
                        isMulti
                        options={politicas}
                        value={habitacion.politicasSeleccionadas}
                        onChange={handlePoliticasChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ciudad</label>
                    <Select
                        options={ciudades}
                        value={habitacion.ciudad}
                        onChange={handleCiudadChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Características</label>
                    <Select
                        isMulti
                        options={caracteristicas}
                        value={caracteristicasSeleccionadas}
                        onChange={handleCaracteristicasChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">WhatsApp</label>
                    <input
                        type="text"
                        className="form-control"
                        name="whatsapp"
                        value={habitacion.whatsapp}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Huéspedes Adultos</label>
                    <input
                        type="number"
                        className="form-control"
                        name="huespedesAdultos"
                        value={habitacion.huespedesAdultos}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Huéspedes Niños</label>
                    <input
                        type="number"
                        className="form-control"
                        name="huespedesNinos"
                        value={habitacion.huespedesNinos}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Imágenes Precargadas</label>
                    <div className="d-flex flex-wrap">
                        {imagenesPrecargadas.map((imagen, index) => (
                            <div key={index} className="m-2 position-relative">
                                <img
                                    src={`https://storage.googleapis.com/habitaciones/${imagen.url}`}
                                    alt={`Imagen ${index + 1}`}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                    onClick={() => handleEliminarImagen(imagen.id)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Subir Nuevas Imágenes</label>
                    <input
                        type="file"
                        className="form-control"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default EditarHabitacion;
