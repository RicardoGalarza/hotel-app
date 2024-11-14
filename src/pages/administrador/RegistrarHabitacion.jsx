import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const RegistrarHabitacion = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [imagenes, setImagenes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [ciudadSeleccionada, setCiudadSeleccionada] = useState(null);
    const [huespedesAdultos, setHuespedesAdultos] = useState(1);
    const [huespedesNinos, setHuespedesNinos] = useState(0);
    const [alerta, setAlerta] = useState({ mostrar: false, tipo: '', mensaje: '' });
    const [politicas, setPoliticas] = useState([]);
    const [politicasSeleccionadas, setPoliticasSeleccionadas] = useState([]);
    const [caracteristicas, setCaracteristicas] = useState([]);
    const [caracteristicasSeleccionadas, setCaracteristicasSeleccionadas] = useState([]);

    useEffect(() => {
        // Obtener categorías
        axios.get(`${process.env.REACT_APP_API_URL}/categorias`)
            .then(response => {
                const opcionesCategorias = response.data.map(categoria => ({
                    value: categoria.id,
                    label: categoria.nombre
                }));
                setCategorias(opcionesCategorias);
            })
            .catch(error => {
                setAlerta({ mostrar: true, tipo: 'danger', mensaje: error.message });
            });

        // Obtener ciudades
        axios.get(`${process.env.REACT_APP_API_URL}/ciudades`)
            .then(response => {
                const opcionesCiudades = response.data.map(ciudad => ({
                    value: ciudad.id,
                    label: ciudad.nombre
                }));
                setCiudades(opcionesCiudades);
            })
            .catch(error => {
                setAlerta({ mostrar: true, tipo: 'danger', mensaje: error.message });
            });

        // Obtener políticas
        axios.get(`${process.env.REACT_APP_API_URL}/politicas`)
            .then(response => {
                const opciones = response.data.map(politica => ({
                    value: politica.id,
                    label: politica.titulo
                }));
                setPoliticas(opciones);
            })
            .catch(error => {
                console.error("Error al obtener las políticas:", error);
            });

        // Obtener características
        axios.get(`${process.env.REACT_APP_API_URL}/caracteristicas`)
            .then(response => {
                const opcionesCaracteristicas = response.data.map(caracteristica => ({
                    value: caracteristica.id,
                    label: caracteristica.nombre
                }));
                setCaracteristicas(opcionesCaracteristicas);
            })
            .catch(error => {
                setAlerta({ mostrar: true, tipo: 'danger', mensaje: 'Error al obtener las características.' });
            });
    }, []);

    const handleCategoriaChange = (selectedOptions) => {
        setCategoriaSeleccionada(selectedOptions);
    };

    const handleCiudadChange = (selectedOption) => {
        setCiudadSeleccionada(selectedOption);
    };

    const handleImagenesChange = (e) => {
        setImagenes([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || !descripcion || !precio || !whatsapp || !imagenes.length || !categoriaSeleccionada.length || !ciudadSeleccionada || !politicasSeleccionadas.length || !caracteristicasSeleccionadas.length) {
            setAlerta({ mostrar: true, tipo: 'danger', mensaje: 'Todos los campos son obligatorios.' });
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('precio', parseFloat(precio));
        formData.append('whatsapp', whatsapp);
        categoriaSeleccionada.forEach(option => formData.append('categorias', option.value));
        politicasSeleccionadas.forEach(option => formData.append('politicas', option.value));
        formData.append('ciudad', ciudadSeleccionada.value);
        imagenes.forEach((imagen) => formData.append('imagenes', imagen));
        formData.append('huespedesAdultos', parseInt(huespedesAdultos, 10));
        formData.append('huespedesNinos', parseInt(huespedesNinos, 10));
        caracteristicasSeleccionadas.forEach(option => formData.append('caracteristicas', option.value));

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/habitaciones`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setAlerta({ mostrar: true, tipo: 'success', mensaje: '¡Habitación registrada con éxito!' });
            setTimeout(() => {
                setAlerta({ mostrar: false, tipo: '', mensaje: '' });
                window.location.reload();
            }, 5000);
        } catch (error) {
            setAlerta({ mostrar: true, tipo: 'danger', mensaje: 'Ha ocurrido un error al registrar la habitación.' });
            setTimeout(() => setAlerta({ mostrar: false, tipo: '', mensaje: '' }), 3000);
        }
    };

    return (
        <div>
            <h2>Registrar Habitación</h2>
            {alerta.mostrar && (
                <div className={`alert alert-${alerta.tipo} alert-dismissible fade show`} role="alert">
                    {alerta.mensaje}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlerta({ mostrar: false, tipo: '', mensaje: '' })}></button>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <input type="text" className="form-control" id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="precio" className="form-label">Precio</label>
                    <input type="number" className="form-control" id="precio" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="categoria" className="form-label">Categoría</label>
                    <Select
                        isMulti
                        options={categorias}
                        value={categoriaSeleccionada}
                        onChange={handleCategoriaChange}
                        placeholder="Selecciona una o más categorías"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="politicas" className="form-label">Políticas</label>
                    <Select
                        isMulti
                        options={politicas}
                        value={politicasSeleccionadas}
                        onChange={(selectedOptions) => setPoliticasSeleccionadas(selectedOptions)}
                        placeholder="Selecciona una o más políticas"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="caracteristicas" className="form-label">Características</label>
                    <Select
                        isMulti
                        options={caracteristicas}
                        value={caracteristicasSeleccionadas}
                        onChange={(selectedOptions) => setCaracteristicasSeleccionadas(selectedOptions)}
                        placeholder="Selecciona una o más características"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="ciudad" className="form-label">Ciudad</label>
                    <Select
                        options={ciudades}
                        value={ciudadSeleccionada}
                        onChange={handleCiudadChange}
                        placeholder="Selecciona una ciudad"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="huespedesAdultos" className="form-label">Huéspedes Adultos</label>
                    <input type="number" className="form-control" id="huespedesAdultos" value={huespedesAdultos} onChange={(e) => setHuespedesAdultos(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="huespedesNinos" className="form-label">Huéspedes Niños</label>
                    <input type="number" className="form-control" id="huespedesNinos" value={huespedesNinos} onChange={(e) => setHuespedesNinos(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="whatsapp" className="form-label">WhatsApp (56 + número)</label>
                    <input type="number" className="form-control" id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="imagenes" className="form-label">Imágenes</label>
                    <input type="file" className="form-control" id="imagenes" multiple onChange={handleImagenesChange} required />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Registrar</button>
            </form>
        </div>
    );
};

export default RegistrarHabitacion;
