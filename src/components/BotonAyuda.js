import React, { useRef } from 'react';

export default function BotonAyuda({ frase }) {
    const referencia = useRef(null)
    const emergente = () => {
        referencia.current.className = 'frase2'
    }
    const desaparecer = () => {
        referencia.current.className = 'frase'
    }
    return (
        <div className="signo">
            <img onClick={emergente} src="../question.png" alt=''/>
            <div ref={referencia} onClick={desaparecer} className="frase"><p><img alt='' width="20px" src="./question.png" /> {frase}</p></div>
        </div>

    )
}