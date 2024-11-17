import axios from 'axios';
import { addMonths, eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';

const CalendarioDoble = ({ habitacionId, onFechaSeleccionada, actualizarCalendario }) => {
  const [fechasNoDisponibles, setFechasNoDisponibles] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  const mesActual = new Date();
  const mesSiguiente = addMonths(mesActual, 1);

  const fetchFechasNoDisponibles = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/reserva/fechas-no-disponibles/habitacion/${habitacionId}`);
      const fechas = response.data.flatMap(rango => 
        eachDayOfInterval({
          start: new Date(rango.fechaInicio + 'T00:00'),
          end: new Date(rango.fechaFin + 'T00:00')
        }).map(dia => format(dia, 'yyyy-MM-dd'))
      );
      setFechasNoDisponibles(fechas);
      setFechaInicio(null);
      setFechaFin(null);
    } catch (err) {
      console.error('Error al cargar las fechas no disponibles');
    }
  }, [habitacionId]);

  useEffect(() => {
    fetchFechasNoDisponibles();
  }, [habitacionId, actualizarCalendario, fetchFechasNoDisponibles]);

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
      setFechaInicio(dia);
      setFechaFin(null);
      onFechaSeleccionada(dia, null);
    } else if (dia.getTime() === fechaInicio.getTime()) {
      setFechaFin(dia);
      onFechaSeleccionada(fechaInicio, dia);
    } else if (dia > fechaInicio) {
      setFechaFin(dia);
      onFechaSeleccionada(fechaInicio, dia);
    }
  };

  const diasMesActual = generarDiasMes(mesActual);
  const diasMesSiguiente = generarDiasMes(mesSiguiente);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12 col-md-6 mb-3">
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

        <div className="col-12 col-md-6 mb-3">
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
