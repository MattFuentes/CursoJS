/* Clase vuelos en el cual agrega pais destino, pais origen, duracion, equipaje */

/* Variables */
let destino = document.getElementById('nuevo-destino');
let seleccionar = document.getElementById('selectContinents');
let equip = document.getElementById('selectEquipaje');
let checkIda = document.getElementById("ida");
let checkVuelta = document.getElementById("vuelta");
let tipoDeVuelo = document.querySelectorAll("input[type=checkbox][name=set]");
let divisaUS = document.getElementById('selDivisasUSD');
let divisaAR = document.getElementById('selDivisasARS');
console.log("Queda a futuro el crear un filtro en el cual segun el continente se realizara el viaje")


class Vuelos {
    constructor(origen, dest, duracion, equipaje, tipo){
        this.origen = origen.toUpperCase();
        this.dest = dest.toUpperCase();
        this.duracion = parseFloat(duracion);
        this.equipaje = equipaje.toUpperCase();
        this.tipo = tipo;
    }
}
const destinos = [];
class Paises {
    constuctor(obj){
        this.id = parseFloat(obj.id);
        this.pais = obj.pais.toUpperCase();
        this.precio = parseFloat(obj.precio)
    }
    sumaIva(){
        this.precio = this.precio * 1.21;
    }
}
/* const paisesAlmacenados = JSON.parse(localStorage.getItem("listaPaises"))
const listadoPaises = [] */
let enabledSettings = []

window.onload = loader;

/* Eventos - Carga Boton y Seleccion */
function loader(){
    destino.addEventListener('submit', nuevoDestino, false);
    seleccionar.addEventListener('select', getSelect, false);
    divisaUS.addEventListener('click', divisasUS, false);
    divisaAR.addEventListener('click', divisasAR, false);
}

/* Funcion de lectura de datos y push en el array */ 
function nuevoDestino(event){
    event.preventDefault();
    let paisOrigenIntro = document.getElementById("origen").value;
    let paisDestinoIntro = document.getElementById("dest").value;
    let duracionIntro = document.getElementById("duracion").value;
    const contenedor = document.getElementById("resultado");
    let tipoVuelo = enabledSettings;
    if (paisDestinoIntro == "" || paisOrigenIntro == "" || duracionIntro == "" || equip.value == ""){
        contenedor.innerHTML = `<h4>Es OBLIGATORIO rellenar todos los campos</h4>`;
        contenedor.classList.add("error");
        document.getElementById("origen").focus();
    } else if(paisDestinoIntro == paisOrigenIntro) {
        contenedor.innerHTML = `<h4>No se puede utilizar el mismo pais de origen como el de destino</h4>`
        contenedor.classList.add("error");
        document.getElementById("dest").focus();
    } else {
        destinos.push(new Vuelos(paisOrigenIntro, paisDestinoIntro, duracionIntro, equip.value, tipoVuelo));
        console.log(destinos)
        for (const destino of destinos){
            contenedor.classList.remove("error");
            contenedor.classList.add("resultado");
            contenedor.innerHTML = `<pre><h4>Origen: ${destino.origen} >> Destino: ${destino.dest} - Duracion: ${destino.duracion} dias - Tipo de Equipaje: ${destino.equipaje} - Tipo de vuelo: ${destino.tipo}</h4></pre>`
        }
    }
}

/* SESSIONSTORAGE SOBRE SELECCION DIVISA */

const prices = sessionStorage.getItem("typePrices");
prices == null ?(
    divisasUS = () => {
        divisaUS.value == 'USD' && sessionStorage.setItem('typePrices', 'USD')
        location.reload()
        },
    divisasAR = () => {
        divisaAR.value == 'ARS' && sessionStorage.setItem('typePrices', 'ARS')
        location.reload()
        }
    ):document.getElementById("divisaSelector").innerHTML=""
const divInner = document.getElementById("divInner");
divInner.innerHTML += `<h4>Divisa: ${prices}</h4>`;
/* TABLA DE CONTINENTES */

const tablaContinentes = document.querySelector('#listaContinentes tbody');
cargarPaises = () => {
    fetch("paises.json")
    .then(res => res.json())
    .then(paises => {
        paises.forEach(pais => {
            const table = document.createElement('tr');
            table.classList.add("table-complete")
            table.innerHTML += `
            <td>${pais.continente}</td>
            <td>${pais.pais}</td>
            `
            prices == "USD" ? (table.innerHTML += `<td>USD ${pais.precio}</td>`) : (table.innerHTML += `<td>ARS ${pais.precio * 260}</td>`);
            tablaContinentes.appendChild(table);
        });
    })
}
cargarPaises();

/* BUSCADOR PARA LA TABLA */

document.addEventListener("keyup", e=> {
    /* Call #Buscador v */ 
    if(e.target.matches("#buscador")) {
        /* Escape = Borrar */
         if (e.key ==="Escape")e.target.value = ""
        /* Buscador v */
        document.querySelectorAll(".table-complete").forEach(element =>{
            element.textContent.toLowerCase().includes(e.target.value.toLowerCase())
            ?element.classList.remove("filtro-table")
            :element.classList.add("filtro-table")
        });
    }
}) 

/* SELECT EN CASCADA Paises */
let continents = ["America", "Europa", "Asia", "Oceania"];
continents.forEach(function(cont){
    let continente = document.createElement("option");
    continente.text = cont;
    continente.value = cont;
    selectContinents.appendChild(continente);
})

function getSelect(){
    seleccionar.value = '' ? document.getElementById('selecciona').innerHTML = "" : document.getElementById('selecciona').innerHTML = `<h5> Se ha seleccionado: <span style="color:blue">${seleccionar.value} </h5>`
}

/* Equipaje Select */
let equipajes = ["Bolso", "Equipaje Mediano", "Equipaje Grande"];
equipajes.forEach(function(equip){
    let equipaj = document.createElement("option");
    equipaj.text = equip;
    equipaj.value = equip;
    selectEquipaje.appendChild(equipaj);
})

getEquipaje = () => {
    console.log(equip.value)
}

/* Checkbox tipo de vuelo */
tipoDeVuelo.forEach(function(tipoCheck){
    tipoCheck.addEventListener('change', function(){
        (checkVuelta.checked) ? (checkIda.checked = false) : (checkIda.checked) && (checkVuelta.checked = false);
        enabledSettings = Array.from(tipoDeVuelo)
        .filter(i => i.checked)
        .map(i => i.value)
    })
});


/* Queda a futuro el crear un filtro en el cual segun el continente se realizara el viaje */
/* Crear json con los paises permitidos - LISTO*/
/* buscador con autocompletado - CASI LISTO*/
/* .JSON por fuera - listo*/
/* Agregar 3 recomendaciones de viajes */
/* Agregar opcion de equipaje - Listo pero a medias */
/* Busqueda por continente - LISTO*/
/* Carrito */