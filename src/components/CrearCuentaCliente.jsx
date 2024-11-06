import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir después de crear la cuenta

const CrearCuentaCliente = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [usuario, setUsuario] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setClave] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: '' });
    const [errores, setErrores] = useState({});
    const navigate = useNavigate();

    // Función para validar correo electrónico
    const validarCorreo = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Función para validar nombre y apellido (mínimo 3 caracteres)
    const validarNombreApellido = (campo) => {
        return campo.trim().length >= 3;
    };

    // Función para validar la contraseña (mínimo 6 caracteres)
    const validarClave = (clave) => {
        return clave.length >= 8 && clave.length <= 30;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let erroresFormulario = {};

        // Validaciones
        if (!validarNombreApellido(nombre)) {
            erroresFormulario.nombre = 'El nombre debe tener al menos 3 caracteres.';
        }

        if (!validarNombreApellido(apellido)) {
            erroresFormulario.apellido = 'El apellido debe tener al menos 3 caracteres.';
        }

        if (!validarCorreo(correo)) {
            erroresFormulario.correo = 'Por favor ingresa un correo electrónico válido.';
        }

        if (!validarClave(password)) {
            erroresFormulario.password = 'La contraseña debe tener entre 8 y 30 caracteres.';
        }

        if (password !== confirmPassword) {
            erroresFormulario.confirmPassword = 'Las contraseñas no coinciden.';
        }

        // Si hay errores, mostrar los mensajes y detener la ejecución
        if (Object.keys(erroresFormulario).length > 0) {
            setErrores(erroresFormulario);
            return;
        }

        try {
            const nuevaCuenta = { nombre, apellido, usuario, correo, clave: password };
            await axios.post(`${process.env.REACT_APP_API_URL}/cuentas/crear?rolId=2`, nuevaCuenta); // Asignar el rol 2 de cliente directamente en la URL
            setAlerta({
                mostrar: true,
                mensaje: 'Cuenta creada exitosamente.',
                tipo: 'success',
            });

            // Limpiar los campos después de la creación de la cuenta
            setNombre('');
            setApellido('');
            setUsuario('');
            setCorreo('');
            setClave('');
            setConfirmPassword('');
            setErrores({}); // Limpiar errores

            // Esperar 3 segundos y redirigir a la página de inicio de sesión
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setAlerta({
                mostrar: true,
                mensaje: 'Error al crear la cuenta.',
                tipo: 'danger',
            });
        }
    };

    return (
        <div className="container" style={{ marginTop: '80px' }}>
            <h2>Crear Cuenta</h2>

            {/* Mostrar la alerta de éxito o error */}
            {alerta.mostrar && (
                <div className={`alert alert-${alerta.tipo} alert-dismissible fade show`} role="alert">
                    {alerta.mensaje}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="apellido" className="form-label">Apellido</label>
                    <input
                        type="text"
                        className={`form-control ${errores.apellido ? 'is-invalid' : ''}`}
                        id="apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        required
                    />
                    {errores.apellido && <div className="invalid-feedback">{errores.apellido}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="usuario" className="form-label">Usuario</label>
                    <input
                        type="text"
                        className="form-control"
                        id="usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                        id="correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                    {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="clave" className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className={`form-control ${errores.password ? 'is-invalid' : ''}`}
                        id="password"
                        value={password}
                        onChange={(e) => setClave(e.target.value)}
                        required
                    />
                    {errores.password && <div className="invalid-feedback">{errores.password}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                    <input
                        type="password"
                        className={`form-control ${errores.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {errores.confirmPassword && <div className="invalid-feedback">{errores.confirmPassword}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Crear Cuenta</button>
            </form>
        </div>
    );
};

export default CrearCuentaCliente;
