import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import HabitacionesDisponibles from '../components/HabitacionesDisponibles';

const Home = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showGuests, setShowGuests] = useState(false);
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
  });

  const [ciudades, setCiudades] = useState([]);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [resultadosFiltrados, setResultadosFiltrados] = useState([]);

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/ciudades`);
        setCiudades(response.data);
      } catch (error) {
        console.error("Error al obtener las ciudades", error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/categorias`);
        const opciones = response.data.map((categoria) => ({
          value: categoria.id,
          label: categoria.nombre,
        }));
        setCategorias(opciones);
      } catch (error) {
        console.error("Error al obtener las categorías", error);
      }
    };

    fetchCiudades();
    fetchCategorias();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
        const categoriasString = categoriasSeleccionadas.map((cat) => cat.value).join(',');

        // Realiza la solicitud de filtrado de habitaciones
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/habitaciones/filtrar`, {
            params: {
                destino: ciudadSeleccionada,
                fechaLlegada: startDate ? startDate.toISOString().split('T')[0] : null,
                fechaSalida: endDate ? endDate.toISOString().split('T')[0] : null,
                adultos: guests.adults,
                ninos: guests.children,
                categoria: categoriasString || null,
            },
        });

        // Asegúrate de manejar correctamente la respuesta
        setResultadosFiltrados(response.data);
    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
    }
};

  const handleGuestChange = (type, action) => {
    setGuests((prev) => ({
      ...prev,
      [type]: action === 'increase' ? prev[type] + 1 : Math.max(prev[type] - 1, 0),
    }));
  };

  return (
    <div>
      <div
        style={{
          backgroundImage: `url('https://img.freepik.com/fotos-premium/lujoso-interior-vestibulo-hotel-esta-decorado-muebles-modernos-e-iluminacion-elegante_717906-109536.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '520px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
        }}
      >
        <div className="card p-4 shadow-lg rounded-lg" style={{ maxWidth: '400px', backgroundColor: '#ffffff', borderRadius: '20px' }}>
          <h2 className="mb-4 text-center">Hoteles en Chile</h2>
          <form onSubmit={handleSearch}>
            <div className="row">
              <div className="col-md-12 mb-3">
                <label htmlFor="destination" className="form-label">¿A dónde quieres ir?</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-geo-alt-fill"></i>
                  </span>
                  <select
                    id="destination"
                    className="form-select"
                    value={ciudadSeleccionada}
                    onChange={(e) => setCiudadSeleccionada(e.target.value)}
                    required
                  >
                    <option value="">Selecciona una ciudad</option>
                    {ciudades.map((ciudad) => (
                      <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <label htmlFor="dates" className="form-label">Fechas</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-calendar"></i>
                  </span>
                  <DatePicker
                    selected={startDate}
                    onChange={(dates) => {
                      const [start, end] = dates;
                      setStartDate(start);
                      setEndDate(end);
                    }}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    className="form-control w-100"
                    placeholderText="Selecciona fechas"
                    dateFormat="dd/MM/yyyy"
                    monthsShown={2}
                    required
                  />
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <label htmlFor="category" className="form-label">Categoría</label>
                <Select
                  isMulti
                  options={categorias}
                  value={categoriasSeleccionadas}
                  onChange={(selectedOptions) => setCategoriasSeleccionadas(selectedOptions)}
                  placeholder="Selecciona una o más categorías"
                />
              </div>

              <div className="col-md-12 mb-4">
                <label htmlFor="guests" className="form-label">Huéspedes</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-people-fill"></i>
                  </span>
                  <button
                    type="button"
                    className="form-control text-start"
                    onClick={() => setShowGuests(!showGuests)}
                  >
                    {guests.adults} adultos, {guests.children} niños
                  </button>
                </div>
                {showGuests && (
                  <div className="mt-2 p-3 border rounded" style={{
                    position: 'absolute',
                    zIndex: 1000,
                    backgroundColor: 'white',
                    width: '300px',
                  }}>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="me-3">Adultos</span>
                      <div className="d-flex align-items-center">
                        <button type="button" onClick={() => handleGuestChange('adults', 'decrease')}>-</button>
                        <span className="mx-2">{guests.adults}</span>
                        <button type="button" onClick={() => handleGuestChange('adults', 'increase')}>+</button>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="me-3">Niños</span>
                      <div className="d-flex align-items-center">
                        <button type="button" onClick={() => handleGuestChange('children', 'decrease')}>-</button>
                        <span className="mx-2">{guests.children}</span>
                        <button type="button" onClick={() => handleGuestChange('children', 'increase')}>+</button>
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary mt-3" onClick={() => setShowGuests(false)}>Listo</button>
                  </div>
                )}
              </div>

              <div className="col-md-12">
                <button type="submit" className="btn btn-primary w-100">Realizar búsqueda</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="container">
        <HabitacionesDisponibles habitacionesFiltradas={resultadosFiltrados} />
      </div>
    </div>
  );
};

export default Home;
