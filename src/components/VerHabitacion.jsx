import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Badge, Button, Modal, Pagination } from 'react-bootstrap'; // Importamos Pagination de react-bootstrap
import { useNavigate } from 'react-router-dom';

const VerHabitacion = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [alerta, setAlerta] = useState({ visible: false, mensaje: '', tipo: '' });

  // Variables para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [productosPerPage] = useState(5);  // Número de productos por página
  const totalPaginas = Math.ceil(productos.length / productosPerPage);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/habitaciones`)
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener las habitaciones:', error);
      });
  }, []);

  const handleClose = () => setShowModal(false);
  const handleShow = (producto) => {
    setProductoAEliminar(producto);
    setShowModal(true);
  };

  const eliminarHabitacion = () => {
    if (productoAEliminar) {
      console.log(productoAEliminar.id); // Verifica que el ID sea correcto
      axios.delete(`${process.env.REACT_APP_API_URL}/habitaciones/${productoAEliminar.id}`)
        .then(() => {
          setProductos(productos.filter(producto => producto.id !== productoAEliminar.id));
          setAlerta({
            visible: true,
            mensaje: 'Habitación eliminada con éxito',
            tipo: 'success'
          });
          setShowModal(false);  // Cierra el modal después de eliminar

          // Ocultar la alerta después de 5 segundos y refrescar la página
          setTimeout(() => {
            setAlerta({ visible: false, mensaje: '', tipo: '' });
            window.location.reload(); // Recargar la página
          }, 3000);
        })
        .catch(error => {
          console.error('Hubo un error al eliminar la habitación:', error);
          setAlerta({
            visible: true,
            mensaje: 'No se pudo eliminar la habitación',
            tipo: 'danger'
          });
          setShowModal(false);  // Cierra el modal en caso de error

          // Ocultar la alerta después de 5 segundos
          setTimeout(() => {
            setAlerta({ visible: false, mensaje: '', tipo: '' });
          }, 5000);
        });
    }
  };

  const handleEditar = (id) => {
    navigate(`/admin/editar-habitacion/${id}`);  // Redirige a la página de edición con el ID de la habitación
  };

  // Nueva función para manejar la administración de características
  // const handleCaracteristicas = (id) => {
  //   navigate(`/admin/habitacion/${id}/caracteristicas`);  // Redirige a la página de administración de características
  // };

  // Obtener los productos actuales para la paginación
  const indexOfLastProducto = currentPage * productosPerPage;
  const indexOfFirstProducto = indexOfLastProducto - productosPerPage;
  const currentProductos = productos.slice(indexOfFirstProducto, indexOfLastProducto);

  // Cambiar de página
  const paginacion = (numeroPagina) => setCurrentPage(numeroPagina);

  return (
    <div className="container mt-5">
      <h2>Habitaciones</h2>

      {/* Alerta de Bootstrap */}
      {alerta.visible && (
        <div className={`alert alert-${alerta.tipo} alert-dismissible fade show`} role="alert">
          {alerta.mensaje}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Categorías</th> {/* Cambiamos el título a plural */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentProductos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>
                {producto.categorias && producto.categorias.length > 0 ? (
                  producto.categorias.map((categoria) => (
                    <Badge key={categoria.id} bg="light" text="dark" className="me-1">
                      {categoria.nombre}
                    </Badge>
                  ))
                ) : (
                  <Badge bg="light" text="dark">Sin categoría</Badge>
                )}
              </td>
              <td>
                <button className="btn btn-secondary me-2" onClick={() => handleEditar(producto.id)}>Editar</button>
                <button className="btn btn-danger me-2" onClick={() => handleShow(producto)}>Eliminar</button>
                {/* Agregamos un nuevo botón para administrar características */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => paginacion(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => paginacion(currentPage - 1)} disabled={currentPage === 1} />

        {/* Mostrando el número de la página actual */}
        <Pagination.Item active>{currentPage}</Pagination.Item>

        <Pagination.Next onClick={() => paginacion(currentPage + 1)} disabled={currentPage === totalPaginas} />
        <Pagination.Last onClick={() => paginacion(totalPaginas)} disabled={currentPage === totalPaginas} />
      </Pagination>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar esta habitación?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarHabitacion}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VerHabitacion;
