import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const VerCategorias = () => {
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
    const [alerta, setAlerta] = useState({ visible: false, mensaje: '', tipo: '' });

    const obtenerCategorias = async (page) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/categorias/pageable?page=${page - 1}&size=15`);
            setCategorias(response.data.content);
            setTotalPaginas(response.data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    };

    useEffect(() => {
        obtenerCategorias(1);
    }, []);

    const paginacion = (pageNumber) => {
        obtenerCategorias(pageNumber);
    };

    const handleEditar = (id) => {
        navigate(`/admin/editar-categoria/${id}`);
    };

    const handleClose = () => setShowModal(false);

    const handleShow = (categoria) => {
        setCategoriaAEliminar(categoria);
        setShowModal(true);
    };

    const eliminarCategoria = () => {
        if (categoriaAEliminar) {
            axios.delete(`${process.env.REACT_APP_API_URL}/categorias/${categoriaAEliminar.id}`)
                .then(() => {
                    setCategorias(categorias.filter(categoria => categoria.id !== categoriaAEliminar.id));
                    setAlerta({
                        visible: true,
                        mensaje: 'Categoría eliminada con éxito',
                        tipo: 'success'
                    });
                    setShowModal(false);
                })
                .catch(error => {
                    console.error('Hubo un error al eliminar la categoría:', error);
                    setAlerta({
                        visible: true,
                        mensaje: 'No se pudo eliminar la categoría',
                        tipo: 'danger'
                    });
                    setShowModal(false);
                });
        }
    };

    return (
        <div className="container mt-5">
            <h2>Listado de Categorías</h2>

            {alerta.visible && (
                <div className={`alert alert-${alerta.tipo} alert-dismissible fade show`} role="alert">
                    {alerta.mensaje}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}

            {categorias.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Imagen</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((categoria) => (
                            <tr key={categoria.id}>
                                <td>{categoria.id}</td>
                                <td>{categoria.nombre}</td>
                                <td>{categoria.descripcion}</td>
                                <td>
                                    {categoria.nombreImagen ? (
                                        <img
                                            src={`https://storage.googleapis.com/habitaciones/${categoria.nombreImagen}`}
                                            alt={categoria.nombre}
                                            style={{ width: '50px', height: 'auto' }}
                                        />
                                    ) : (
                                        'Sin imagen'
                                    )}
                                </td>
                                <td>
                                    <button className="btn btn-secondary me-2" onClick={() => handleEditar(categoria.id)}>Editar</button>
                                    <button className="btn btn-danger" onClick={() => handleShow(categoria)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="alert alert-warning" role="alert">
                    No se encontraron categorías disponibles.
                </div>
            )}

            {/* Paginación */}
            <Pagination className="justify-content-center">
                <Pagination.First onClick={() => paginacion(1)} disabled={currentPage === 1} />
                {[...Array(totalPaginas).keys()].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => paginacion(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Last onClick={() => paginacion(totalPaginas)} disabled={currentPage === totalPaginas} />
            </Pagination>

            {/* Modal de Confirmación de Eliminación */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que deseas eliminar esta categoría?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={eliminarCategoria}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default VerCategorias;
