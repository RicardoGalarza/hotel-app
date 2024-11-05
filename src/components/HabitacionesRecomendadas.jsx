import axios from 'axios';
import React, { useEffect, useState } from 'react';

const HabitacionesRecomendadas = () => {
    const [habitacionesRecomendadas, setHabitacionesRecomendadas] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHabitacionesRecomendadas = async () => {
            try {
                const response = await axios.get('http://localhost:8080/habitaciones/recomendadas');
                setHabitacionesRecomendadas(response.data);
            } catch (err) {
                console.error('Hubo un error al obtener las habitaciones recomendadas', err);
                setError('Hubo un problema al cargar las habitaciones recomendadas. Por favor, intenta más tarde.');
            }
        };

        fetchHabitacionesRecomendadas();
    }, []);

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Habitaciones Recomendadas</h2>

            {/* Mostrar mensaje de error si ocurre */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="row">
                {habitacionesRecomendadas.length > 0 ? (
                    habitacionesRecomendadas.map((habitacion) => (
                        <div className="col-md-4 mb-4" key={habitacion.id}>
                            <div className="card h-100">
                                <img src={habitacion.imageUrl} alt={habitacion.name} className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">{habitacion.name}</h5>
                                    <p className="card-text">{habitacion.description}</p>
                                    <p className="card-text"><strong>{habitacion.price}</strong></p>
                                    <a href={`/habitaciones/${habitacion.id}`} className="btn btn-primary">Ver Detalles</a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p className="text-center">No hay habitaciones recomendadas en este momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HabitacionesRecomendadas;
