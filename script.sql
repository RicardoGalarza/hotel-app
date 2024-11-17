INSERT INTO rol (nombre) VALUES ('administrador');
INSERT INTO rol (nombre) VALUES ('cliente');

INSERT INTO permiso (nombre) VALUES ('crear habitacion');
INSERT INTO permiso (nombre) VALUES ('ver listado de habitaciones');
INSERT INTO permiso (nombre) VALUES ('editar habitacion');
INSERT INTO permiso (nombre) VALUES ('ver detalle de habitacion');
INSERT INTO permiso (nombre) VALUES ('listar habitacion');
INSERT INTO permiso (nombre) VALUES ('crear categoria');
INSERT INTO permiso (nombre) VALUES ('listar categoria');
INSERT INTO permiso (nombre) VALUES ('crear cuentas');
INSERT INTO permiso (nombre) VALUES ('administracion');
INSERT INTO permiso (nombre) VALUES ('listar cuentas');
INSERT INTO permiso (nombre) VALUES ('home page');
INSERT INTO permiso (nombre) VALUES ('listar caracteristicas');
INSERT INTO permiso (nombre) VALUES ('crear caracteristica');


INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 1);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 2);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 3);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 4);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 5);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 6);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 7);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 8);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 9);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 10);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 11);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 12);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 13);

INSERT INTO ciudad (nombre) VALUES
(1, 'Hotel Sheraton Santiago'),
(2, 'Hotel Diego de Almagro Antofagasta'),
(3, 'Hotel Dreams Araucanía'),
(4, 'Hotel Casino Antay'),
(5, 'Hotel Cumbres Puerto Varas'),
(6, 'Hotel Terrado Suites Iquique'),
(7, 'Hotel Enjoy Coquimbo'),
(8, 'Hotel Alto Atacama'),
(9, 'Hotel Dreams Punta Arenas'),
(10, 'Hotel O\Higgins');


INSERT INTO categoria (id, nombre, descripcion, fecha_creacion, nombre_imagen)
VALUES
(1, 'Lujo Urbano', 'Suites modernas con vistas espectaculares de la ciudad', CURRENT_DATE, 'Lujo Urbano'),
(2, 'Relax Playero', 'Habitaciones con vistas al mar y acceso a la playa', CURRENT_DATE, 'Relax Playero'),
(3, 'Exclusividad Total', 'Espacios amplios con servicios de lujo', CURRENT_DATE, 'Exclusividad Total'),
(4, 'Familiar y Confortable', 'Habitaciones ideales para familias y grupos', CURRENT_DATE, 'Familiar y Confortable'),
(5, 'Vista al Cielo', 'Terrazas con piscina y vistas impresionantes', CURRENT_DATE, 'Vista al Cielo'),
(6, 'Romance y Relax', 'Habitaciones diseñadas para momentos especiales', CURRENT_DATE, 'Romance y Relax'),
(7, 'Naturaleza y Aventura', 'Cabañas en entornos naturales', CURRENT_DATE, 'Naturaleza y Aventura'),
(8, 'Moderno y Minimalista', 'Espacios para trabajar y descansar', CURRENT_DATE, 'Moderno y Minimalista'),
(9, 'Colonial e Histórico', 'Habitaciones con encanto clásico', CURRENT_DATE, 'Colonial e Histórico'),
(10, 'Oasis en la Ciudad', 'Suites con jardines privados para desconectar', CURRENT_DATE, 'Oasis en la Ciudad');

INSERT INTO politicas (id, descripcion, titulo)
VALUES
(1, 'Cancelación gratuita hasta 48 horas antes de la fecha de llegada.', 'Política de Cancelación'),
(2, 'Prohibido fumar en todas las habitaciones y áreas comunes. Multa aplicable por incumplimiento.', 'No Fumar'),
(3, 'Las mascotas son bienvenidas con un cargo adicional y previa notificación.', 'Mascotas Permitidas'),
(4, 'Check-in a partir de las 3 PM y check-out antes de las 11 AM.', 'Check-in y Check-out'),
(5, 'Todos los huéspedes deben presentar una identificación válida al momento del check-in.', 'Identificación Requerida'),
(6, 'Horario de silencio obligatorio desde las 10 PM hasta las 8 AM para respetar el descanso.', 'Política de Silencio'),
(7, 'No se permiten más huéspedes que los indicados en la reserva.', 'Capacidad Máxima'),
(8, 'El uso de la piscina y gimnasio está reservado exclusivamente para los huéspedes registrados.', 'Uso de las Instalaciones'),
(9, 'No se permiten fiestas ni reuniones en las habitaciones.', 'Prohibición de Fiestas'),
(10, 'Se requiere un depósito de seguridad reembolsable al momento del check-in.', 'Depósito de Seguridad');


INSERT INTO caracteristica (nombre, imagen_nombre) VALUES
(1, 'Wi-Fi gratuito'),
(2, 'Piscina'),
(3, 'Desayuno',),
(4, 'Spa',),
(5, 'Gimnasio',),
(6, 'Transporte al aeropuerto'),
(7, 'Restaurante gourmet'),
(8, 'Estacionamiento privado'),
(9, 'Servicio a la habitación'),
(10, 'Área de juegos',),




