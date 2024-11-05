import React, { useEffect, useState } from 'react';

const InformacionPersonal = () => {
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await fetch(`http://localhost:8080/cuentas/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    
                    throw new Error('Error al obtener la información del usuario');
                }

                const data = await response.json();
                
                setUsuario({
                    id: data.id,
                    nombre: data.nombre,
                    apellido: data.apellido,
                    correo: data.correo,
                });
            } catch (error) {
                console.error('Error al obtener la información del usuario:', error);
                setError('Nesecita Haber Iniciado Sesion');
            }
        };

        fetchUserData();
    }, []);

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!usuario) {
        return <div>Cargando información del usuario...</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Información Personal</h2>
            <table className="table table-bordered table-striped">
                <tbody>
                    
                    <tr>
                        <th scope="row">Nombre:</th>
                        <td>{usuario.nombre}</td>
                    </tr>
                    <tr>
                        <th scope="row">Apellido:</th>
                        <td>{usuario.apellido}</td>
                    </tr>
                    <tr>
                        <th scope="row">Correo:</th>
                        <td>{usuario.correo}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default InformacionPersonal;
