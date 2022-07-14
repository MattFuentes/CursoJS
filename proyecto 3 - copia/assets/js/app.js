/* Clase vuelos en el cual agrega pais destino, pais origen, duracion, equipaje */

/* Variables */
let newDestiny = document.querySelector('#nuevo-destino'),
    selectContinents = document.querySelector('#selectContinents'),
    selectBaggage = document.querySelector('#selectBaggage'),
    selectType = document.querySelector('#selectType'),
    valueUS = document.querySelector('#selDivisasUSD'),
    valueAR = document.querySelector('#selDivisasARS'),
    enabledSettings = [],
    newDestinys = [],
    flys = [];

/* Clase vuelos para el inicio de la reserva */
class Fly {
    constructor(originFly, destinyFly, duracion, equipaje, tipo){
        this.originFly = originFly.toUpperCase();
        this.destinyFly = destinyFly.toUpperCase();
        this.duracion = parseFloat(duracion);
        this.equipaje = equipaje.toUpperCase();
        this.tipo = tipo;
    }
}
/* Clase Paises para tabla con JSON*/
class Country {
    constructor(id, continente, pais, precio){
        this.id = id;
        this.continente = continente;
        this.pais = pais;
        this.precio = parseFloat(precio)
    }
    sumaIva(){
        this.precio = this.precio * 1.21;
    }
}
window.onload = loader;

/* Eventos - Carga Boton y Seleccion */
function loader(){
    newDestiny.addEventListener('submit', getDestiny, false);
    selectContinents.addEventListener('select', getSelect, false);
}

/* Funcion de lectura de datos y push en el array */ 
function getDestiny(event){
    event.preventDefault();
    let paisOrigenIntro = document.querySelector("#originFly").value;
    let paisDestinoIntro = document.querySelector("#destinyFly").value;
    let duracionIntro = document.querySelector("#duracion").value;
    const container = document.querySelector("#resultado");
    if (paisDestinoIntro == "" || paisOrigenIntro == "" || duracionIntro == "" || selectBaggage.value == ""){
        Swal.fire({
            title: 'Atención!',
            text: 'Debes de rellenar todos los campos',
            icon: 'error',
            confirmButtonText: 'Entendido'
        })      
        document.querySelector("#originFly").focus();
    } else if(paisDestinoIntro == paisOrigenIntro) {
        Swal.fire({
            title: 'Atención!',
            text: 'No puedes utilizar el mismo origen y destino, alguno debe de ser distinto',
            icon: 'error',
            confirmButtonText: 'Entendido'
        })        
        document.querySelector("#destinyFly").focus();
    } else {
        newDestinys.push(new Fly(paisOrigenIntro, paisDestinoIntro, duracionIntro, selectBaggage.value, selectType.value ));
        for (const newDestiny of newDestinys){
            Swal.fire({
                title: 'Reserva realizada!',
                text: 'Se ha realizado la reserva!',
                icon: 'success',
                confirmButtonText: 'Continuar'
            })
            container.classList.add("resultado");
            container.innerHTML = `<pre><h4>Origen: ${newDestiny.originFly} >> Destino: ${newDestiny.destinyFly} - Duracion: ${newDestiny.duracion} dias - Tipo de Equipaje: ${newDestiny.equipaje} - Tipo de vuelo: ${newDestiny.tipo}</h4></pre>`/* tipo de vuelo falta */
        }
    }
}

/* SESSIONSTORAGE SOBRE SELECCION DIVISA */
const prices = sessionStorage.getItem("typePrices");
prices == null 
    ?(valueUS.addEventListener('click', valuesUS = () => {
        valueUS.value == 'USD' && sessionStorage.setItem('typePrices', 'USD')
        location.reload()
    }),
    valueAR.addEventListener('click', valuesAR = () => {
        valueAR.value == 'ARS' && sessionStorage.setItem('typePrices', 'ARS')
        location.reload()
    })) : document.querySelector("#divisaSelector").innerHTML=""
const divInner = document.querySelector("#divInner");
divInner.innerHTML += `<h4>Divisa: ${prices}</h4>`;

/* TABLA DE CONTINENTES */
const tableContinents = document.querySelector('#listaContinentes tbody');
const cargarPaises = () => {
    fetch("paises.json")
    .then(res => res.json())
    .then(paises => {
        paises.forEach(pais => {
            const table = document.createElement('tr');
            table.classList.add("table-complete");
            table.innerHTML += `
            <td>${pais.continente}</td>
            <td>${pais.pais}</td>
            `
            prices == "USD" ? (table.innerHTML += `<td>USD ${pais.precio}</td>`) : (table.innerHTML += `<td>ARS ${pais.precio * 260}</td>`);
            tableContinents.appendChild(table);
            flys.push(new Country(pais.id, pais.continente, pais.pais, pais.precio));
        });
        console.log({flys});
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

/* SELECT EN CASCADA Continentes */
let continent = ["America", "Europa", "Asia", "Oceania"];
continent.forEach(function(cont){
    let continents = document.createElement("option");
    continents.text = cont;
    continents.value = cont;
    selectContinents.appendChild(continents);
}) 

/* SELECT EN CASCADA Paises */
let originCountry = ["Argentina", "Brazil", "España", "Alemania", "China", "Rusia", "Japon"];
originCountry.forEach(function(orgC){
    let orgCountry = document.createElement("option");
    let destCountry = document.createElement("option");
    orgCountry.text = orgC;
    orgCountry.value = orgC;
    destCountry.text = orgC;
    destCountry.value = orgC;
    destinyFly.appendChild(destCountry);
    originFly.appendChild(orgCountry);
}) 

function getSelect(){
    document.querySelector('#selectContinentsSpan').innerHTML = `<h5> Se ha seleccionado: <span style="color:blue">${selectContinents.value != '' ? selectContinents.value : document.querySelector('#selectContinentsSpan').innerText = '' } </h5>`
}

/* Equipaje Select */
let baggage = ["Bolso", "Equipaje Mediano", "Equipaje Grande"];
baggage.forEach(function(equip){
    let equipaj = document.createElement("option");
    equipaj.text = equip;
    equipaj.value = equip;
    selectBaggage.appendChild(equipaj);
})

/* Tipo vuelo Select */
let typeFly = ["Solo Ida", "Ida y Vuelta"];
typeFly.forEach(function(typeF){
    let typeFlight = document.createElement("option");
    typeFlight.text = typeF;
    typeFlight.value = typeF;
    selectType.appendChild(typeFlight);
})

/* Autocompletado (TODO) */
let input = document.querySelector('#originFly');
let sugerencia = document.querySelector('#sugerencia');

input.addEventListener("keyup", (e) =>{
    let key = e.target.value;
    if(key.lenght > 0){
        // Buscador v
        search(key)
    }
});

const search = () => {
    fetch('paises.json')
    .then((res) => res.json())
    .then(paises => {
        paises.forEach(pais => {
        console.log(pais.pais)
    })
})
}
