import React, { useRef } from 'react';
import A from './Inputs.styled'
import BotonAyuda from './BotonAyuda'

export default function Input({ name, funcion, frase, defecto }) {
    const input = useRef(null);
    function aumentar(e) {
        e.preventDefault();
        input.current.value++
        funcion(input.current)
    }
    function restar(e) {
        e.preventDefault();
        if (input.current.value > 1) {
            input.current.value--
            funcion(input.current)
        }
    }
    function original() {
        funcion(input.current)
    }
    return (
        <div>
            <label>Número de {name} </label>
            <A onClick={aumentar}>+</A>
            <input ref={input} name={name} type="number" min="1" value={defecto} onChange={original}></input>
            <A onClick={restar}>-</A>
            <BotonAyuda frase={frase}/>
        </div>
    )
}