import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';

const ListarCuentas = () => {
    const [cuentas, setCuentas] = useState([]);
    const [alerta, setAlerta] = useState({ mensaje: '', tipo: '' });

    useEffect(() => {
        obtenerCuentas();  // Obtener las cuentas al cargar el componente
    }, []);

    const obtenerCuentas = () => {
        axios.get('http://localhost:8080/cuentas')
            .then(response => {
                console.log(response.data);  // Verifica la estructura de los datos
                setCuentas(response.data);
                // console.log(JSON.stringify(response.data));
                // Guarda las cuentas en el estado
            })
            .catch(error => {
                console.error('Hubo un error al obtener las cuentas', error);
                setAlerta({ mensaje: 'Error al obtener las cuentas', tipo: 'danger' });
            });
    };

    const actualizarRol = (cuentaId, nuevoRol) => {
        axios.put(`http://localhost:8080/cuentas/${cuentaId}/rol`, { rolId: nuevoRol })
            .then(() => {
                console.log('Rol actualizado correctamente');
                setAlerta({ mensaje: 'Rol actualizado correctamente', tipo: 'success' });
                obtenerCuentas();  // Refrescar la lista de cuentas después de la actualización
            })
            .catch(error => {
                console.error('Error al actualizar el rol', error);
                setAlerta({ mensaje: 'Error al actualizar el rol', tipo: 'danger' });
            });
    };

    const handleRolChange = (cuentaId, event) => {
        const nuevoRol = event.target.value; // Obtener el valor seleccionado directamente
        actualizarRol(cuentaId, nuevoRol);
    };


    return (
        <div className="container mt-5">
            <h2>Listado de Cuentas</h2>

            {/* Alerta de Bootstrap */}
            {alerta.mensaje && (
                <div className={`alert alert-${alerta.tipo}`} role="alert">
                    {alerta.mensaje}
                </div>
            )}

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        {/* <th>Acciones</th> */}
                    </tr>
                </thead>
                <tbody>
                    {cuentas.map((cuenta) => (
                        <tr key={cuenta.id}>
                            <td>{cuenta.id}</td>
                            <td>{cuenta.nombre || 'Sin nombre'}</td>
                            <td>{cuenta.correo || 'Sin email'}</td>
                            <td>
                                {/* Select para cambiar el rol */}
                                {console.log('hhhhhhhhh: ',)}


                                <select
                                    className="form-select"
                                    value={cuenta.rol ? String(cuenta.rol) : ''} // Asegúrate de que el valor sea el id del rol como cadena
                                    onChange={(event) => handleRolChange(cuenta.id, event)}
                                >
                                    <option value="1">Administrador</option>
                                    <option value="2">Cliente</option>
                                </select>


                            </td>

                            {/* <td>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleRolChange(cuenta.id, cuenta.rol?.nombre === 'Administrador' ? 1 : 2)}
                                >
                                    Cambiar Rol
                                </button>
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListarCuentas;
