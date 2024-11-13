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
                    const { data } = response;
                    if (data === "Reserva confirmada con éxito.") {
                        setMensaje(
                            <Alert variant="success" className="p-5 shadow-lg rounded text-center">
                                <h1 className="alert-heading">¡Reserva confirmada con éxito!</h1>
                                <p className="mt-3 mb-4">
                                    Gracias por confiar en nuestros servicios. Tu reserva ha sido confirmada con éxito. 
                                    Puedes verificar los detalles accediendo a tu cuenta.
                                </p>
                                <Button variant="success" href="/mi-cuenta" className="btn-lg">
                                    Ver detalles
                                </Button>
                            </Alert>
                        );
                    } else if (data === "La reserva ya estaba confirmada.") {
                        setMensaje(
                            <Alert variant="warning" className="p-5 shadow-lg rounded text-center">
                                <h1 className="alert-heading">Reserva ya confirmada</h1>
                                <p className="mt-3 mb-4">
                                    Esta reserva ya había sido confirmada previamente. Si tienes preguntas, no dudes en contactarnos.
                                </p>
                                <Button variant="warning" href="/contacto" className="btn-lg">
                                    Contactar soporte
                                </Button>
                            </Alert>
                        );
                    } else {
                        setMensaje(
                            <Alert variant="danger" className="p-5 shadow-lg rounded text-center">
                                <h1 className="alert-heading">Error al confirmar la reserva</h1>
                                <p className="mt-3 mb-4">
                                    Hubo un problema al procesar tu solicitud. Por favor, intenta de nuevo más tarde o comunícate con soporte.
                                </p>
                                <Button variant="danger" href="/contacto" className="btn-lg">
                                    Contactar soporte
                                </Button>
                            </Alert>
                        );
                    }
                })
                .catch(() => {
                    setMensaje(
                        <Alert variant="danger" className="p-5 shadow-lg rounded text-center">
                            <h1 className="alert-heading">Error al confirmar la reserva</h1>
                            <p className="mt-3 mb-4">
                                Hubo un problema al procesar tu solicitud. Por favor, intenta de nuevo más tarde o comunícate con nuestro equipo de soporte.
                            </p>
                            <Button variant="danger" href="/contacto" className="btn-lg">
                                Contactar soporte
                            </Button>
                        </Alert>
                    );
                });
        } else {
            setMensaje(
                <Alert variant="danger" className="p-5 shadow-lg rounded text-center">
                    <h1 className="alert-heading">ID de reserva no válido</h1>
                    <p className="mt-3 mb-4">
                        Parece que el ID de la reserva proporcionado no es válido. Verifica el enlace o comunícate con soporte.
                    </p>
                    <Button variant="danger" href="/contacto" className="btn-lg">
                        Contactar soporte
                    </Button>
                </Alert>
            );
        }
    }, [location.search]);

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            {mensaje}
        </Container>
    );
};

export default ConfirmarReserva;
