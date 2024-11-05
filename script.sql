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

INSERT INTO ciudad (id, nombre) VALUES (1, 'Talca');
INSERT INTO ciudad (id, nombre) VALUES (2, 'Santiago');
INSERT INTO ciudad (id, nombre) VALUES (3, 'Linares');

INSERT INTO categoria (id, nombre, descripcion, fecha_creacion, ruta_imagen) VALUES
(1, 'Deluxe', 'Habitaciones de lujo con vistas increíbles', '2024-11-03 12:00:00', 'deluxe.jpg'),
(2, 'Económica', 'Habitaciones sencillas y asequibles', '2024-11-03 12:10:00', 'economica.jpg'),
(3, 'Familiar', 'Habitaciones amplias para toda la familia', '2024-11-03 12:20:00', 'familiar.jpg'),
(4, 'Suite', 'Suites con servicios exclusivos', '2024-11-03 12:30:00', 'suite.jpg'),
(5, 'Negocios', 'Habitaciones equipadas para viajeros de negocios', '2024-11-03 12:40:00', 'negocios.jpg');

INSERT INTO caracteristica (nombre, imagen_nombre) VALUES
('Wi-Fi gratis', 'wifi.jpg'),
('Piscina', 'piscina.jpg'),
('Desayuno incluido', 'desayuno.jpg'),
('Estacionamiento', 'estacionamiento.jpg'),
('Gimnasio', 'gimnasio.jpg');

INSERT INTO politica (id, titulo, descripcion) VALUES
(1, 'Política de Cancelación', 'Cancelación gratuita hasta 24 horas antes de la llegada.'),
(2, 'No Fumar', 'Prohibido fumar en las habitaciones y áreas cerradas.'),
(3, 'Mascotas Permitidas', 'Las mascotas son bienvenidas con previo aviso.'),
(4, 'Check-In y Check-Out', 'Check-in a partir de las 3 PM y check-out hasta las 11 AM.'),
(5, 'Identificación Requerida', 'Se requiere una identificación válida al momento del check-in.');

INSERT INTO ciudad (nombre) VALUES
('Santiago'),
('Valparaíso'),
('Concepción'),
('La Serena'),
('Punta Arenas');
