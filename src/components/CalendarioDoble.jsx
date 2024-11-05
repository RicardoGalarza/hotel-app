import axios from 'axios';
import { addMonths, eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import React, { useEffect, useState } from 'react';

const CalendarioDoble = ({ habitacionId, onFechaSeleccionada, actualizarCalendario }) => {
  const [fechasNoDisponibles, setFechasNoDisponibles] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  const mesActual = new Date();
  const mesSiguiente = addMonths(mesActual, 1);

  // Función para cargar las fechas no disponibles
  const fetchFechasNoDisponibles = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/reserva/fechas-no-disponibles/habitacion/${habitacionId}`);
      const fechas = response.data.flatMap(rango => 
        eachDayOfInterval({
          start: new Date(rango.fechaInicio + 'T00:00'),
          end: new Date(rango.fechaFin + 'T00:00')
        }).map(dia => format(dia, 'yyyy-MM-dd'))
      );
      setFechasNoDisponibles(fechas);

      // Restablece las fechas seleccionadas al actualizar las fechas no disponibles
      setFechaInicio(null);
      setFechaFin(null);
    } catch (err) {
      console.error('Error al cargar las fechas no disponibles');
    }
  };

  // Efecto para cargar las fechas al inicio y cuando `actualizarCalendario` cambie
  useEffect(() => {
    fetchFechasNoDisponibles();
  }, [habitacionId, actualizarCalendario]);

  const generarDiasMes = (mes) => {
    const inicioMes = startOfMonth(mes);
    const finMes = endOfMonth(mes);
    return eachDayOfInterval({ start: inicioMes, end: finMes }).map((dia) => ({
      fecha: dia,
      noDisponible: fechasNoDisponibles.includes(format(dia, 'yyyy-MM-dd')),
      seleccionado:
        (fechaInicio && !fechaFin && dia.getTime() === fechaInicio.getTime()) ||
        (fechaInicio && fechaFin && dia >= fechaInicio && dia <= fechaFin),
    }));
  };

  const handleDayClick = (dia) => {
    if (!fechaInicio || (fechaInicio && fechaFin)) {
      // Si no hay fecha de inicio o ya hay un rango seleccionado, reinicia y selecciona una nueva fecha de inicio
      setFechaInicio(dia);
      setFechaFin(null);
      onFechaSeleccionada(dia, null);
    } else if (dia.getTime() === fechaInicio.getTime()) {
      // Si se hace clic en la misma fecha, se trata de una reserva de un solo día
      setFechaFin(dia);
      onFechaSeleccionada(fechaInicio, dia);
    } else if (dia > fechaInicio) {
      // Si se hace clic en una fecha posterior, establece la fecha final
      setFechaFin(dia);
      onFechaSeleccionada(fechaInicio, dia);
    }
  };

  const diasMesActual = generarDiasMes(mesActual);
  const diasMesSiguiente = generarDiasMes(mesSiguiente);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col">
          <h5>{format(mesActual, 'MMMM yyyy')}</h5>
          <div className="d-flex flex-wrap">
            {diasMesActual.map((dia, index) => (
              <div
                key={index}
                className="p-2 border"
                onClick={() => !dia.noDisponible && handleDayClick(dia.fecha)}
                style={{
                  width: '14.28%',
                  textAlign: 'center',
                  cursor: dia.noDisponible ? 'not-allowed' : 'pointer',
                  color: dia.noDisponible ? 'grey' : dia.seleccionado ? 'white' : 'black',
                  backgroundColor: dia.seleccionado ? '#804000' : dia.noDisponible ? '#e0e0e0' : 'transparent',
                }}
              >
                {format(dia.fecha, 'd')}
              </div>
            ))}
          </div>
        </div>

        <div className="col">
          <h5>{format(mesSiguiente, 'MMMM yyyy')}</h5>
          <div className="d-flex flex-wrap">
            {diasMesSiguiente.map((dia, index) => (
              <div
                key={index}
                className="p-2 border"
                onClick={() => !dia.noDisponible && handleDayClick(dia.fecha)}
                style={{
                  width: '14.28%',
                  textAlign: 'center',
                  cursor: dia.noDisponible ? 'not-allowed' : 'pointer',
                  color: dia.noDisponible ? 'grey' : dia.seleccionado ? 'white' : 'black',
                  backgroundColor: dia.seleccionado ? '#804000' : dia.noDisponible ? '#e0e0e0' : 'transparent',
                }}
              >
                {format(dia.fecha, 'd')}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarioDoble;
