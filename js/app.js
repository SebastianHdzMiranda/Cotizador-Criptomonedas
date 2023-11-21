// Selectores
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: '',
}

document.addEventListener('DOMContentLoaded', ()=> {
    consultarCriptomonedas();

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
    
    formulario.addEventListener('submit', enviarFormulario);
});

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    fetch(url)
        .then( respuesta => respuesta.json())
        .then( data => obtenerCriptomonedas(data.Data))
        .then( criptomonedas => imprimirCriptomonedas(criptomonedas));
}

// Crear un promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});

function imprimirCriptomonedas(criptomonedas) {
    criptomonedas.forEach( criptomoneda => {
        const {CoinInfo: {FullName, Name}} = criptomoneda;

        const option = document.createElement('option');
        option.value = Name;
        option.innerHTML = FullName;

        criptomonedasSelect.appendChild(option);
    });
}

// funcion helper que me rellena el objBusqueda
const leerValor= e => objBusqueda[e.target.name] = e.target.value;

function enviarFormulario(e) {
    e.preventDefault();   

    const {moneda, criptomoneda} = objBusqueda;
    if (moneda ==='' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son requeridos');
        return;
    }

    consultarAPI();
}

function consultarAPI() {
    const {criptomoneda, moneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( data  => mostrarCotizacion(data.DISPLAY[criptomoneda][moneda]))
}

function mostrarCotizacion(cotizacion) {

    limpiarHTML();

    const  {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.className = 'precio';
    precio.innerHTML = `<span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>El precio más alto del dia es: <span>${HIGHDAY}</span></p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>El precio más bajo del dia es: <span>${LOWDAY}</span></p>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación ultimas 24Hrs: <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Ultima actualización: <span>${LASTUPDATE}</span></p>`;


    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarAlerta(mensaje) {
    const existeError = document.querySelector('.error');

    if (!existeError) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
    
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 2000);
    }
}

function mostrarSpinner() {
    limpiarHTML();


    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    resultado.appendChild(spinner);
}
