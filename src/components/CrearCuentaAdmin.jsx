import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CrearCuentaAdmin = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [usuario, setUsuario] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setClave] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rolId, setRolId] = useState(''); // Campo para seleccionar el rol
    const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: '' });
    const [errores, setErrores] = useState({});
    const navigate = useNavigate();

    // Validar el formulario
    const validarFormulario = () => {
        let erroresFormulario = {};
        if (!nombre || nombre.trim().length < 3) {
            erroresFormulario.nombre = 'El nombre debe tener al menos 3 caracteres.';
        }
        if (!apellido || apellido.trim().length < 3) {
            erroresFormulario.apellido = 'El apellido debe tener al menos 3 caracteres.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            erroresFormulario.correo = 'Por favor ingresa un correo electrónico válido.';
        }
        if (!password || password.length < 8) {
            erroresFormulario.password = 'La contraseña debe tener entre 8 y 30 caracteres.';
        }
        if (password !== confirmPassword) {
            erroresFormulario.confirmPassword = 'Las contraseñas no coinciden.';
        }
        if (!rolId) {
            erroresFormulario.rolId = 'Debe seleccionar un rol.';
        }
        setErrores(erroresFormulario);
        return Object.keys(erroresFormulario).length === 0;
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) return;

        try {
            const nuevaCuenta = { nombre, apellido, usuario, correo, clave: password, rolId };
            await axios.post(`${process.env.REACT_APP_API_URL}/cuentas/crear?rolId=${rolId}`, nuevaCuenta);
            setAlerta({ mostrar: true, mensaje: 'Cuenta creada exitosamente.', tipo: 'success' });

            // Limpiar los campos después de la creación de la cuenta
            setNombre('');
            setApellido('');
            setUsuario('');
            setCorreo('');
            setClave('');
            setConfirmPassword('');
            setRolId('');
            setErrores({});

            setTimeout(() => {
                navigate('/admin/crear-cuenta');
            }, 3000);
        } catch (error) {
            setAlerta({ mostrar: true, mensaje: 'Error al crear la cuenta.', tipo: 'danger' });
        }
    };

    return (
        <div className="container mt-5">
            <h2>Crear Cuenta (Admin)</h2>

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
                        className={`form-control ${errores.usuario ? 'is-invalid' : ''}`}
                        id="usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                    />
                    {errores.usuario && <div className="invalid-feedback">{errores.usuario}</div>}
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
                        id="clave"
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

                <div className="mb-3">
                    <label htmlFor="rol" className="form-label">Rol</label>
                    <select
                        value={rolId}
                        onChange={(e) => setRolId(e.target.value)}
                        className="form-select"
                    >
                        <option value="">Seleccionar rol</option>
                        <option value="1">Administrador</option>
                        <option value="2">Cliente</option>
                    </select>
                    {errores.rolId && <div className="invalid-feedback">{errores.rolId}</div>}
                </div>

                <button type="submit" className="btn btn-primary">Crear Cuenta</button>
            </form>
        </div>
    );
};

export default CrearCuentaAdmin;
