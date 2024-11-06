import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './ConfirmarReserva.css'; // Puedes agregar esta línea si quieres aplicar estilos personalizados

const ConfirmarReserva = () => {
    const [mensaje, setMensaje] = useState('Verificando el estado de tu reserva...');
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const reservaId = params.get('reservaId');

        if (reservaId) {
            axios.put(`${process.env.REACT_APP_API_URL}/reserva/confirmar?reservaId=${reservaId}`)
                .then(response => {
                    if (response.data === "Reserva confirmada con éxito.") {
                        setMensaje(
                            <Alert variant="success" className="custom-alert">
                                <h4 className="alert-heading">¡Reserva confirmada con éxito!</h4>
                                <p className="mb-2">
                                    Gracias por elegir nuestros servicios. Tu reserva ha sido confirmada y está lista.
                                </p>
                                <hr />
                                <p className="mb-0">
                                    Puedes revisar los detalles en tu cuenta o comunicarte con nosotros si necesitas asistencia.
                                </p>
                            </Alert>
                        );
                    } else if (response.data === "La reserva ya estaba confirmada.") {
                        setMensaje(
                            <Alert variant="warning" className="custom-alert">
                                <h4 className="alert-heading">Reserva ya confirmada</h4>
                                <p className="mb-2">
                                    Esta reserva ya fue confirmada previamente. Si tienes alguna duda, no dudes en contactarnos.
                                </p>
                                <hr />
                                <p className="mb-0">
                                    Contacta a nuestro equipo de soporte si necesitas más información.
                                </p>
                            </Alert>
                        );
                    } else {
                        setMensaje(
                            <Alert variant="danger" className="custom-alert">
                                <h4 className="alert-heading">Error al confirmar la reserva</h4>
                                <p className="mb-2">
                                    Hubo un problema al procesar tu solicitud.
                                </p>
                                <hr />
                                <p className="mb-0">
                                    Por favor, inténtalo de nuevo más tarde o comunícate con nuestro equipo de soporte.
                                </p>
                            </Alert>
                        );
                    }
                })
                .catch(error => {
                    console.error('Error al confirmar la reserva:', error);
                    setMensaje(
                        <Alert variant="danger" className="custom-alert">
                            <h4 className="alert-heading">Error al confirmar la reserva</h4>
                            <p className="mb-2">
                                Hubo un problema al procesar tu solicitud.
                            </p>
                            <hr />
                            <p className="mb-0">
                                Por favor, inténtalo de nuevo más tarde o comunícate con nuestro equipo de soporte.
                            </p>
                        </Alert>
                    );
                });
        } else {
            setMensaje(
                <Alert variant="danger" className="custom-alert">
                    <h4 className="alert-heading">ID de reserva no válido</h4>
                    <p className="mb-2">
                        Parece que el ID de la reserva proporcionado no es válido.
                    </p>
                    <hr />
                    <p className="mb-0">
                        Verifica el enlace o comunícate con soporte para obtener ayuda.
                    </p>
                </Alert>
            );
        }
    }, [location.search]);

    return (
        <Container className="mt-5">
            {mensaje}
        </Container>
    );
};

export default ConfirmarReserva;
