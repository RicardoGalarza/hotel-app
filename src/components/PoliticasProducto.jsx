import React from 'react';

const PoliticasProducto = ({ politicas }) => {
    return (
        <div className="mt-4">
            <h3 className="text-start mb-4">
                Políticas del Producto
            </h3>
            <div className="row">
                {politicas.map((politica, index) => (
                    <div key={index} className="col-md-6 mb-3">
                        <h5>{politica.titulo}</h5>
                        <p>{politica.descripcion}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PoliticasProducto;
