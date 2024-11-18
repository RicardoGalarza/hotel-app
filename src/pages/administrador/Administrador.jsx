import React, { useEffect, useState } from 'react';
import { Card, Container, ListGroup, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Administrador = () => {
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const isLoggedIn = localStorage.getItem('isAdmin');
        if (!isLoggedIn) {
            // Redirigir al login si no está autenticado
            navigate('/administracion');
        }
    }, [navigate]);

    useEffect(() => {
        // Verificar si es un dispositivo móvil
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
            setIsMobile(true);
        }
    }, []);

    if (isMobile) {
        return (
            <div className="container mt-5">
                <h1 className="text-center">Panel no disponible en dispositivos móviles</h1>
                <p className="text-center">Accede desde un ordenador para utilizar el panel de administración.</p>
            </div>
        );
    }

    // Mostrar el panel solo si el usuario está autenticado
    return (
        <div className="container mt-5">
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand href="#home">Panel de Administración</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/admin/crearhabitacion">Crear Habitación</Nav.Link>
                            <Nav.Link as={Link} to="/admin/verhabitacion">Ver Habitaciones</Nav.Link>
                            <Nav.Link as={Link} to="/admin/crear-categoria">Crear Categoría</Nav.Link>
                            <Nav.Link as={Link} to="/admin/ver-categorias">Ver Categorías</Nav.Link>
                            <Nav.Link as={Link} to="/admin/listar-caracteristicas">Listar Características</Nav.Link>
                            <Nav.Link as={Link} to="/admin/crear-caracteristica">Crear Característica</Nav.Link>
                            <Nav.Link as={Link} to="/admin/crear-cuenta">Crear Cuenta</Nav.Link>
                            <Nav.Link as={Link} to="/admin/listar-cuentas">Listar Cuentas</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Card className="p-4 shadow-lg">
                <Card.Body>
                    <Card.Title className="text-center">Bienvenido Administrador</Card.Title>
                    <Card.Text>
                        Aquí puedes acceder a todas las funciones desarrolladas para la administración de tu negocio.
                    </Card.Text>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Link to="/admin/crearhabitacion" className="btn btn-outline-primary w-100">
                                Crear Habitación
                            </Link>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Link to="/admin/verhabitacion" className="btn btn-outline-primary w-100">
                                Ver Habitaciones
                            </Link>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Link to="/admin/crear-categoria" className="btn btn-outline-primary w-100">
                                Crear Categoría
                            </Link>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Link to="/admin/ver-categorias" className="btn btn-outline-primary w-100">
                                Ver Categorías
                            </Link>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Link to="/admin/listar-caracteristicas" className="btn btn-outline-primary w-100">
                                Listar Características
                            </Link>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Link to="/admin/crear-caracteristica" className="btn btn-outline-primary w-100">
                                Crear Característica
                            </Link>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Link to="/admin/crear-cuenta" className="btn btn-outline-primary w-100">
                                Crear Cuenta
                            </Link>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Link to="/admin/listar-cuentas" className="btn btn-outline-primary w-100">
                                Listar Cuentas
                            </Link>
                        </ListGroup.Item>
                    </ListGroup>
                    <em className="mt-3 d-block text-muted">Nota: Esta página no es accesible desde dispositivos móviles.</em>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Administrador;
