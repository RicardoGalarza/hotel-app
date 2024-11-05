import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const GaleriaCompleta = () => {
    const { id } = useParams();
    const [habitacion, setHabitacion] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHabitacion = async () => {
            try {
                const response = await fetch(`http://localhost:8080/habitaciones/${id}`);
                const data = await response.json();
                setHabitacion(data);
            } catch (err) {
                setError('Error al cargar la galería completa');
            }
        };

        fetchHabitacion();
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!habitacion || habitacion.imagenes.length === 0) {
        return <div>No hay imágenes para mostrar</div>;
    }

    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsZoomed(false);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((currentImageIndex + 1) % habitacion.imagenes.length);
        setIsZoomed(false);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex(
            (currentImageIndex + habitacion.imagenes.length - 1) % habitacion.imagenes.length
        );
        setIsZoomed(false);
    };

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    const handleVolver = () => {
        navigate(`/habitaciones/${id}`);
    };

    return (
        <div className="container mt-5 pt-5">
            <h2 className="text-center">Galeria Completa</h2>
            <div className="row mb-3">
                {habitacion.imagenes.map((imagen, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <img
                            src={`http://localhost:8080/${habitacion.id}/${imagen.nombre}`}
                            alt={`Imagen ${index + 1}`}
                            className="img-fluid"
                            style={{ width: "100%", height: "200px", objectFit: "cover", cursor: "pointer" }}
                            onClick={() => handleImageClick(index)}
                        />
                    </div>
                ))}
            </div>

            {/* Modal para mostrar la imagen ampliada */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Body className="p-0 position-relative">
                    {/* Flecha anterior */}
                    <button
                        className="btn btn-light position-absolute top-50 start-0 translate-middle-y"
                        onClick={handlePrevImage}
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            border: "none",
                            fontSize: "24px",
                            zIndex: 10,
                        }}
                    >
                        &lt;
                    </button>

                    {/* Imagen principal */}
                    <img
                        src={`http://localhost:8080/${habitacion.id}/${habitacion.imagenes[currentImageIndex].nombre}`}
                        alt={`Imagen ${currentImageIndex + 1}`}
                        className={`w-100 ${isZoomed ? "zoomed" : ""}`}
                        style={{
                            maxHeight: "80vh",
                            objectFit: "cover",
                            cursor: "zoom-in",
                            transition: "transform 0.3s ease",
                            transform: isZoomed ? "scale(1.5)" : "scale(1)",
                        }}
                        onClick={toggleZoom}
                    />

                    {/* Flecha siguiente */}
                    <button
                        className="btn btn-light position-absolute top-50 end-0 translate-middle-y"
                        onClick={handleNextImage}
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            border: "none",
                            fontSize: "24px",
                            zIndex: 10,
                        }}
                    >
                        &gt;
                    </button>
                </Modal.Body>
            </Modal>

            {/* Botón Volver Atrás */}
            <div className="text-end mb-5">
                <button onClick={handleVolver} className="btn btn-primary">
                    Volver Atrás
                </button>
            </div>
        </div>
    );
};

export default GaleriaCompleta;
