import './App.css';
import React, { useState, useEffect, useRef } from 'react'
import Panel from './App.styled'
import Input from './components/Inputs'
import Side from './components/Side'
const valors = new Map();

function App() {
  //Referencias
  const nomPre = useRef(null)
  const nomCli = useRef(null)
  const refWeb = useRef(null)
  const refSeo = useRef(null)
  const refAds = useRef(null)
  //Estados
  const [estado, setEstado] = useState(0);
  const [cliente, setCliente] = useState(new Map())
  const [[subtotal, total], setTotal] = useState([0, 0]);
  const [activo, setActivo] = useState('none');
  const [[pagina, idioma], setPagina] = useState([1, 1]);
  const nuevosElements = new Map();
  const separadorElementos = '--'
  const sep = '::'
  const frases = ["En este componente debe indicar el número de páginas que tendrá su página web", "En este componente debe indicar la cantidad de idiomas que tendrá su página web"]

  //local storage
  // eslint-disable-next-line
  useEffect(() => {
    //Relleno opciones
    if (estado === 0) {
      refWeb.current.checked = (localStorage.web === 'true');
      refSeo.current.checked = (localStorage.seo === 'true');
      refAds.current.checked = (localStorage.ads === 'true');
      calcularPrecio(refWeb.current)
      calcularPrecio(refSeo.current)
      calcularPrecio(refAds.current)
      if (localStorage.listado !== undefined) {
        var localy = localStorage.getItem('listado').split(separadorElementos)
        localy.forEach((element) => {
          var nuevoItem = element.split(sep)
          const nuevaFecha = new Date(nuevoItem[3])
          nuevosElements.set(nuevoItem[0], { name: nuevoItem[0], cliente: nuevoItem[4], total: nuevoItem[1], servicios: nuevoItem[2], fecha: nuevaFecha })
        })
        setCliente(nuevosElements)
      }
      setEstado(1);
    }
  })

  const calcularPaginas = (e) => {
    var numPag = pagina;
    var numIdioma = idioma;
    if (e.name === 'paginas') {
      setPagina([e.value, idioma]);
      numPag = e.value
    }
    else {
      setPagina([pagina, e.value]);
      numIdioma = e.value
    }
    setTotal([subtotal, subtotal + (numPag * numIdioma * 30)])
  }

  const calcularPrecio = (e) => {
    if (e.target) {
      e = e.target
    }
    var objetoActual = { name: e.name, value: e.value, activo: e.checked }
    valors.set(e.name, objetoActual)
    setTotal(0)
    var sub = 0;
    var idiomas = pagina * idioma * 30;
    valors.forEach((element) => {
      if (element.activo) {
        if (element.name === 'web') {
          setActivo('block')
        }
        sub += parseInt(element.value)
      }
      else {
        if (element.name === 'web') {
          setActivo('none');
          idiomas = 0;
        }
      }
    })
    setTotal([sub, sub + idiomas]);
    almacenajeLocal();
  }

  const almacenajeLocal = (servicios) => {
    //local Storage Activos
    valors.forEach((element) => {
      localStorage.setItem(element.name, element.activo)
    })
    //Local Storage Presupuestos
    if (servicios!==undefined) {
      var fecha = new Date();
      if (localStorage.listado === undefined) {
        localStorage.setItem('listado', nomPre.current.value + sep + total + sep + servicios + sep + fecha + sep + nomCli.current.value)
      } else {
        const localAnterior = localStorage.getItem('listado')
        localStorage.setItem('listado', localAnterior + separadorElementos + nomPre.current.value + sep + total + sep + servicios + sep + fecha + sep + nomCli.current.value)
      }
    }
  }

  const guardar = (e) => {
    e.preventDefault();
    setCliente(() => {
      const clientesMap = new Map();
      for (const x of cliente) {
        clientesMap.set(x[0], x[1])
      }
      //Deconstruyo los servicios
      var stringServicios = ''
      valors.forEach((element) => {
        if (element.activo)
          stringServicios += element.name + ', '
      })
      var servicios = stringServicios.slice(0, stringServicios.length - 2) //Le quito la coma final
      //Los almaceno
      almacenajeLocal(servicios)
      clientesMap.set(nomPre.current.value, { name: nomPre.current.value, cliente: nomCli.current.value, total: total, servicios: servicios, fecha: new Date() })
      return clientesMap
    })
  }

  return (
    <div className="App">
      <Side clientes={cliente} />
      <form>
        <p>Qué quieres hacer?</p>
        <input placeholder="Nombre de presupuesto" ref={nomPre} min="1" />
        <input placeholder="Cliente" ref={nomCli} min="1" />
        <button onClick={guardar}>Guardar</button><br></br>
        <input onChange={calcularPrecio} ref={refWeb} name="web" value="500" type="checkbox" />
        <label>Una página web</label><br></br>
        <Panel display={activo}>
          <Input name="paginas" frase={frases[0]} funcion={calcularPaginas}></Input>
          <Input name="idiomas" frase={frases[1]} funcion={calcularPaginas}></Input>
        </Panel>
        <input onClick={calcularPrecio} ref={refSeo} name="seo" value="800" type="checkbox" />
        <label>Una consultoría SEO</label><br></br>
        <input onClick={calcularPrecio} ref={refAds} name="ads" value="1200" type="checkbox" />
        <label>Una campaña de Google Ads</label><br></br>
      </form>
      <p>Total: {total}€</p>
    </div>
  );
}

export default App;
