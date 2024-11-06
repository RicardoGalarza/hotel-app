import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

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
                            <Alert variant="success" className="p-4 shadow rounded">
                                <h4 className="alert-heading">¡Reserva confirmada con éxito!</h4>
                                <p className="mb-3">
                                    Gracias por elegir nuestros servicios. Tu reserva ha sido confirmada y está lista.
                                    Puedes revisar los detalles en tu cuenta o comunicarte con nosotros si necesitas asistencia.
                                </p>
                                <hr />
                                <Button variant="success" href="/mi-cuenta" className="mt-2">
                                    Ver detalles en mi cuenta
                                </Button>
                            </Alert>
                        );
                    } else if (response.data === "La reserva ya estaba confirmada.") {
                        setMensaje(
                            <Alert variant="warning" className="p-4 shadow rounded">
                                <h4 className="alert-heading">Reserva ya confirmada</h4>
                                <p className="mb-3">
                                    Esta reserva ya fue confirmada previamente. Si tienes alguna duda, no dudes en contactarnos.
                                </p>
                                <hr />
                                <Button variant="warning" href="/contacto" className="mt-2">
                                    Contactar soporte
                                </Button>
                            </Alert>
                        );
                    } else {
                        setMensaje(
                            <Alert variant="danger" className="p-4 shadow rounded">
                                <h4 className="alert-heading">Error al confirmar la reserva</h4>
                                <p className="mb-3">
                                    Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde
                                    o comunícate con nuestro equipo de soporte.
                                </p>
                                <hr />
                                <Button variant="danger" href="/contacto" className="mt-2">
                                    Contactar soporte
                                </Button>
                            </Alert>
                        );
                    }
                })
                .catch(error => {
                    console.error('Error al confirmar la reserva:', error);
                    setMensaje(
                        <Alert variant="danger" className="p-4 shadow rounded">
                            <h4 className="alert-heading">Error al confirmar la reserva</h4>
                            <p className="mb-3">
                                Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde
                                o comunícate con nuestro equipo de soporte.
                            </p>
                            <hr />
                            <Button variant="danger" href="/contacto" className="mt-2">
                                Contactar soporte
                            </Button>
                        </Alert>
                    );
                });
        } else {
            setMensaje(
                <Alert variant="danger" className="p-4 shadow rounded">
                    <h4 className="alert-heading">ID de reserva no válido</h4>
                    <p className="mb-3">
                        Parece que el ID de la reserva proporcionado no es válido.
                        Por favor, verifica el enlace o comunícate con soporte para obtener ayuda.
                    </p>
                    <hr />
                    <Button variant="danger" href="/contacto" className="mt-2">
                        Contactar soporte
                    </Button>
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
