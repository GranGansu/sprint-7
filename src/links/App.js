import './App.css';
import React, { useState, useEffect, useRef } from 'react'
import Panel from './App.styled'
import Input from '../components/Inputs'
import Side from '../components/Side'
const seleccionServicios = new Map();
const url = window.location.origin + '/presupuesto';

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
  const precioPagina = 30;
  const separadorElementos = '---'
  const frases = ["En este componente debe indicar el número de páginas que tendrá su página web", "En este componente debe indicar la cantidad de idiomas que tendrá su página web"]

  //local storage
  // eslint-disable-next-line
  useEffect(() => {
    //Relleno opciones
    if (estado === 0) {
      var verdadero;
      var pagina
      var idioma
      if (getParametrosURL()) {
        verdadero = true;
        const barra = window.location.search.replace('?', '').split('&')
        var web = (barra[0].match('true') !== null)
        var seo = (barra[1].match('true') !== null)
        var ads = (barra[2].match('true') !== null)
        refWeb.current.checked = web
        refSeo.current.checked = seo
        refAds.current.checked = ads
        seleccionServicios.set(refWeb.current.name, { name: refWeb.current.name, value: refWeb.current.value, activo: web })
        seleccionServicios.set(refSeo.current.name, { name: refSeo.current.name, value: refSeo.current.value, activo: seo })
        seleccionServicios.set(refAds.current.name, { name: refAds.current.name, value: refAds.current.value, activo: ads })
        pagina = parseInt(barra[3].match(/(\d+)/g)[0])
        idioma = parseInt(barra[4].match(/(\d+)/g)[0])
        almacenajeLocal(undefined, [pagina, idioma])
      } else {
        verdadero = false;
        refWeb.current.checked = (localStorage.web === 'true');
        refSeo.current.checked = (localStorage.seo === 'true');
        refAds.current.checked = (localStorage.ads === 'true');
        pagina = ((localStorage.pagina === undefined) ? 1 : localStorage.pagina)
        idioma = ((localStorage.idioma === undefined) ? 1 : localStorage.idioma)
      }
      setPagina([pagina, idioma])
      //Relleno el Side
      if (localStorage.listado !== undefined) {
        var listadoLocal = localStorage.getItem('listado').slice(0, -3)
        const presupuestosLocales = listadoLocal.split(separadorElementos)
        presupuestosLocales.forEach((element) => {
          const elementoJSON = JSON.parse(element)
          nuevosElements.set(elementoJSON.name, elementoJSON)
        })
        setCliente(nuevosElements)
      }
      calcularPrecio(pagina, idioma, verdadero)
      setEstado(1);
    }
    actualizarURL();
  })

  const calcularPaginas = (e) => {
    var numPag = (e.name === 'paginas') ? e.value : pagina;
    var numIdioma = (e.name !== 'paginas') ? e.value : idioma;
    setPagina(((e.name === 'paginas') ? [e.value, idioma] : [pagina, e.value]))
    setTotal([subtotal, subtotal + (numPag * numIdioma * 30)])
    almacenajeLocal(undefined, [numPag, numIdioma]);
  }

  const getParametrosURL = () => {
    const vertigo = (window.location.search.match('true') !== null)
    return vertigo
  }

  const actualizarURL = () => {
    var newURL = '?';
    seleccionServicios.forEach((element) => {
      newURL += element.name + '=' + element.activo + '&'
    })
    var urlFinal = newURL.slice(0, -1) + `&numPag=${pagina}&numLang=${idioma}`
    window.history.pushState('', '', `${url}/${urlFinal}`)
  }

  const calcularPrecio = (pagina, idioma, vertigo) => {
    if (pagina === undefined || idioma === undefined) {
      pagina = 1;
      idioma = 1;
    }
    if (!vertigo) {
      seleccionServicios.set(refSeo.current.name, { name: refSeo.current.name, value: refSeo.current.value, activo: refSeo.current.checked })
      seleccionServicios.set(refAds.current.name, { name: refAds.current.name, value: refAds.current.value, activo: refAds.current.checked })
      seleccionServicios.set(refWeb.current.name, { name: refWeb.current.name, value: refWeb.current.value, activo: refWeb.current.checked })
    }
    var sub = 0;
    var idiomas = pagina * idioma * precioPagina;
    seleccionServicios.forEach((element) => {
      if (element.activo) {
        if (element.name === 'web') {
          setActivo('block')
        }
        sub += parseInt(element.value)
      }
      else {
        if (element.name === 'web') {
          idiomas = 0;
          setActivo('none')
        }
      }
    })
    setTotal([sub, sub + idiomas]);
    almacenajeLocal(undefined, [pagina, idioma]);
  }

  const almacenajeLocal = (servicios, numeros, clientesMap) => {
    //Local Storage Presupuestos
    var nuevoString = '';
    if (servicios !== undefined) {
      clientesMap.forEach((value) => {
        nuevoString += JSON.stringify(value) + separadorElementos
      })
      localStorage.setItem('listado', nuevoString)
    } else if (numeros !== undefined) {
      //local Storage Activos
      seleccionServicios.forEach((element) => {
        localStorage.setItem(element.name, element.activo)
      })
      //Local Storage Páginas
      localStorage.setItem('pagina', numeros[0])
      localStorage.setItem('idioma', numeros[1])
    }
  }

  const chequearCampos = () => {
    if (nomPre.current.value === '') {
      nomPre.current.className = 'rojo'
      nomPre.current.placeholder = '* campo obligatorio'
      nomPre.current.focus()
    } else if (nomCli.current.value === '') {
      nomPre.current.className = ''
      nomCli.current.focus()
      nomCli.current.placeholder = '* campo obligatorio'
      nomCli.current.className = 'rojo'
    } else {
      nomPre.current.className = ''
      nomCli.current.className = ''
      return true
    }
  }

  const guardar = (e) => {
    e.preventDefault();
    if (chequearCampos()) {
      setCliente(() => {
        const clientesMap = new Map();
        for (const x of cliente) {
          clientesMap.set(x[0], x[1])
        }
        //Deconstruyo los servicios
        var stringServicios = ''
        seleccionServicios.forEach((element) => {
          if (element.activo)
            stringServicios += element.name + ', '
        })
        const servicios = stringServicios.slice(0, - 2) //Le quito la coma final
        //Los almaceno
        clientesMap.set(nomPre.current.value, { name: nomPre.current.value, cliente: nomCli.current.value, total: total, servicios: servicios, fecha: new Date() })
        almacenajeLocal(servicios, null, clientesMap)
        return clientesMap
      })
    }
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
          <Input name="paginas" frase={frases[0]} funcion={calcularPaginas} defecto={pagina}></Input>
          <Input name="idiomas" frase={frases[1]} funcion={calcularPaginas} defecto={idioma}></Input>
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
