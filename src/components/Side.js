import React, { useState, useRef } from 'react';

export default function Side({ clientes }) {
    var elementos = [];
    const inputBuscador = useRef(null)
    for (const x of clientes) {
        elementos.push(x[1])
    }
    const [ordenar, setOrdenar] = useState(null)
    const [nombrePresupuesto, setNombrePresupuesto] = useState('')
    const ordenarA = (e) => {
        e.preventDefault();
        setOrdenar(e.target.name)
    }
    const buscar = (e) => {
        setNombrePresupuesto(e.target.value)
    }
    const borrarTodo = () => {
        localStorage.clear()
    }

    return (
        <div className="side">
            <input onChange={buscar} ref={inputBuscador} placeholder="Buscar..."></input>
            <button name="alpha" onClick={ordenarA}>Ordenar alfabéticamente</button>
            <button name="date" onClick={ordenarA}>Ordenar por fecha</button>
            <button name="original" onClick={ordenarA}>Reiniciar orden</button>
            <button onClick={borrarTodo}>Borrar localStorage</button>
            {
                elementos.sort((a, b) => {
                    if (ordenar === 'alpha') {
                        const aa = a.name.toLowerCase();
                        const bb = b.name.toLowerCase();
                        if (aa < bb) { return -1; }
                        if (aa > bb) { return 1; }
                    }
                    else if (ordenar === 'date') {
                        if (a.fecha < b.fecha) { return -1; }
                        if (a.fecha > b.fecha) { return 1; }
                    } else if (ordenar === 'original') {
                        inputBuscador.current.value = ''
                        setNombrePresupuesto('')
                        setOrdenar(null)
                    }
                    return 0;
                }// eslint-disable-next-line
                ).map((element, key) => {
                    try {
                        if (element.name.match(nombrePresupuesto.toString())) {
                            var texto = nombrePresupuesto.toString();
                            const nuevaFecha = new Date(element.fecha).toDateString()
                            if (nombrePresupuesto.toString() !== '') {
                                var splitt = element.name.replace(texto,'99999').split('99999')
                            }else{
                                splitt = [element.name,'']
                                texto = ''
                            }
                            return <div key={key}>
                                <hr></hr>
                                <p >Presupuesto: {splitt[0]}<b>{texto}</b>{splitt[1]}</p>
                                <p >Cliente: {element.cliente}</p>
                                <p >Total: {element.total}€</p>
                                <p >Servicios: {element.servicios}</p>
                                <p>Fecha: {nuevaFecha}</p>
                            </div>
                        }
                    }
                    catch (e) { console.error(e) }
                })
            }
        </div>
    )
}