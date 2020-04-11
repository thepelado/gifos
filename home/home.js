/* End Points */
const searchEndpoint = 'https://api.giphy.com/v1/gifs/search?q=';
const trendingEndpoint = 'https://api.giphy.com/v1/gifs/trending';
const randomEndpoint = 'https://api.giphy.com/v1/gifs/random';
const sugerenciasURL = 'https://suggestqueries.google.com/complete/search?output=firefox';
const cantOpcionesSugeredias = 3;

var inputBusqueda = document.getElementById("txt-buscar");
var btnBuscar = document.getElementById("btn-buscar");

var arraySugerencias = new Array();
var cantSugerencias = 4;
var cantidadTendencia = 12;

/* Cuando carga la pagina  busca las sugerencias y las tendencias */
window.onload = function() {
    //Registro Visita
    visitCounter();

    //Fijo el theme seleccionado
    if (localStorage.getItem("theme")) //Si hay theme
    {
        let theme = localStorage.getItem("theme")
        if (theme === "day")
        {
            this.btnThemeDay.click();
        }
        else
        {
            this.btnThemeNight.click();
        }
    }
    else
    {
        this.btnThemeDay.click();
    }

    btnBuscar.disabled = true;

    //Cargo Sugerencias 
    for (let index = 0; index < cantSugerencias; index++) {
        getRandomResult();
    }
    getTrendingResults();
};

/* Search button event assing */
btnBuscar.addEventListener("click", () => {
  getSearchResults(inputBusqueda.value);
});

/* Random Suggestions */
function getRandomResult() {
    const found = fetch(randomEndpoint + '?api_key=' + apiKey+'&tag=&rating=G')
        .then(response => {
            return response.json();
        })
        .then(resdata => { //Ver uso de map aca
            let datos = resdata.data;
            saveRandomResult({ url: datos.images.original.url, titulo: datos.title });
            return datos;
        })
        .catch(error => {
            return error;
        });
    return found;
}

function saveRandomResult(array) {
    //Guardo en un array las sugerencias
    arraySugerencias.push(array);
    //Maqueto el contenido
    insertRandomResult();
}

function insertRandomResult() {

    //Borro si tiene contenido
    let container = document.getElementById("resultado-random");  
    container.innerHTML = "";

    //Maqueto el contenido
    for(let i=0; i < arraySugerencias.length; i++) {

        let contenido = document.createElement("div");
        //Limpio el titulo
        let titulo = getTagsForTitle(arraySugerencias[i].titulo);
        let button = titulo.replace("#", " ");
        //
        contenido.setAttribute("class", "container sugerido");
        contenido.innerHTML =
            '<div class="etiqueta gradient">' +
            '<p> ' + titulo + '  </p>' +
            '<img class="btn-cerrar" onclick="removeRandomSuggestion('+i+');" src = "../../assets/images/close.svg" alt = "#" > ' +
            '</div><img class="gif" src=' + arraySugerencias[i].url + ' alt="'+ titulo +'" >' +
            '<button class="btn btn-ver-mas" id="btn-select-theme" onClick="getSearchResults(\''+ button +'\');">' +
            '<span class="text">Ver más...</span>' +
            '</button>';
        container.appendChild(contenido);
    }
}

function getTagsForTitle(title) {
    title = title.replace("GIF", "");
    title = title.replace("by", "");
    title = title.split(" ");
    let cont = 0;
    let result = "";    
    for (let i = 0; i < title.length; i++)
    {
        if (title[i].length > 0 && cont < 3) {
            result += "#"+title[i]+" ";
            cont++;
        }
        if (cont === 3) {
            break;
        }        
    }
    return result;
}

function removeRandomSuggestion(index) {
    //Remuevo el item del arreglo
    arraySugerencias.splice(index,1);
    //Solicito uno nuevo
    getRandomResult();
}

/* Trending */
function getTrendingResults() {
    const found = fetch(trendingEndpoint + '?api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(resultado => {
            insertTrendingResults(resultado.data);
            return data;
        })
        .catch(error => {
            return error;
        });
    return found;
}

function insertTrendingResults(array) {

    //Borro si tiene contenido
    let container = document.getElementById("resultado-tendencias");  
    let cont = 0;
    let contDobles = 0;
    for (let i=0; i < array.length && cont < cantidadTendencia; i++) {
        //Maqueto el contenido
        let clase_doble = '';
        if (contDobles < 4 && (array[i].images.original.width >= (array[i].images.original.height * 1.4)))
        {
            if (cont + 2 <= cantidadTendencia) {
                clase_doble = "doble";
                contDobles++;
                cont+=2;
            }
            else {
                cont++;
            }
        }
        else {
            cont++;
        }
        let contenido = document.createElement("div");
        contenido.setAttribute("class", "tendencia "+ clase_doble);
        let titulo = getTagsForTitle(array[i].title);
        contenido.innerHTML =
            '<div class="container">'+
            '<img src=' + array[i].images.original.url + ' alt="#" >' +
            '<div class="footer gradient">' + titulo + '</div>' +
            '</div>';
        container.appendChild(contenido);
    }
}

/* Search Suggestions */
inputBusqueda.addEventListener("input", () => {
    let valor = inputBusqueda.value.trim();

    if (valor) {
        document.getElementById("btn-buscar").disabled = false;
        //muestro el boton eliminar ???
        obtenerSugerencias(valor, 'actualizarSugerencias');

    } else {
        document.getElementById("btn-buscar").disabled = true;
        //escondo el boton eliminar ???
        //Escondo el div de sugerencias
        let container = document.getElementById("lista-sugerencias");
        container.innerHTML = "";
    }
});

function obtenerSugerencias(palabra, callback) {
    console.log("haciendo la consulta");
    //creo la URL para la consulta
    let url = sugerenciasURL + '&q=' + palabra + "&callback=" + callback;
    //llamo la funcion que me actualiza el scrip
    actulizarScrip(url);
}

function actulizarScrip(url) {

    let nuevoScript = document.createElement("script");

    nuevoScript.setAttribute("src", url);
    nuevoScript.setAttribute("id", "jsonp");

    let viejoScript = document.getElementById("jsonp");

    let body = document.getElementsByTagName("body")[0];

    if (viejoScript == null) {
        body.appendChild(nuevoScript);
    } else {
        body.replaceChild(nuevoScript, viejoScript);
    }
}

function actualizarSugerencias(obj) {

    let resultado = obj[1].slice(0, cantSugerencias-1);
    //Borro si tiene contenido y la muestro
    let container = document.getElementById("lista-sugerencias");
    container.innerHTML = "";
    container.classList.remove("hidden");

    //Armo los botones con las sugerencias
    for (let i=0; i < cantSugerencias-1; i++)
    {
        //Maqueto el contenido
        let contenido = document.createElement("div");
        contenido.setAttribute("class", "sugerencia");
        contenido.innerHTML = '<button name="btn-opt-sugerido" type="button" class="btn btn-sugerido" onClick="getSearchResults(\''+resultado[i]+'\')">' +
                            '<span>'+ resultado[i] +'</span>' +
                            '</button>';
        container.appendChild(contenido);
    }
}

// Search Results
function getSearch(search) {
    const found = fetch(searchEndpoint + search + '&api_key=' + apiKey)
    .then(response => {
        return response.json();
    })
    .then(resultado => {
        return resultado.data;
    })
    .catch(error => {
        return error;
    });
return found;
}

function getSearchResults(search) {
    
    //Asigno el valor a buscar a la caja por si aprete ver más en tendencia
    inputBusqueda.value = search;

    //Habilito el boton de busqueda
    btnBuscar.disabled = false;

    //Realizo la busqueda
    getSearch(search).then( respuesta => {
        insertSearchResults(search, respuesta);
    });

    //Obtengo las sugerencias
    obtenerSugerencias(search, 'actualizarBtnSugerencias');
   
    //Limpio las sugerencias
    let container = document.getElementById("lista-sugerencias");
    container.innerHTML = "";

    insertSearchResults(search, getSearch(search));
}

function actualizarBtnSugerencias(obj) {
    resultado = obj[1].slice(0, cantSugerencias-1);

    //Borro si tiene contenido y la muestro
    let container = document.getElementById("lista-btn-sugerencias");
    container.innerHTML = "";

    //Armo los botones con las sugerencias
    for (let i=0; i < resultado.length; i++)
    {
        let titulo = getTagsForTitle(resultado[i]);
        //Maqueto el contenido
        let contenido = document.createElement("div");
        contenido.innerHTML = '<button name="btn-opt-sugerido" type="button" class="btn btn-secondary" onClick="getSearchResults(\''+resultado[i]+'\')">' +
                            '<span class="text">'+ titulo +'</span>' +
                            '</button>';
        container.appendChild(contenido);
    }
}

function insertSearchResults(criterio, resultado) {
    //Quito la clase que oculta la sección
    let section = document.getElementById("section-resultados-busqueda"); 
    section.classList.remove("hidden");

    //Borro si tiene contenido
    let container = document.getElementById("resultado-busqueda");
    container.innerHTML = "";

    //Seteo el titulo
    let titulo = document.getElementById("criterio-busqueda");
    titulo.innerHTML = criterio + " (resultados)";

    for (let i=0; i < (resultado.length - 1); i++) {
        //Maqueto el contenido
        let contenido = document.createElement("div");
        contenido.setAttribute("class", "item");
        contenido.innerHTML =
            '<div class="container">'+
            '<img src=' + resultado[i].images.original.url + ' alt="#" >' +
            '<div class="footer gradient">' + resultado[i].title + '</div>' +
            '</div>';
        container.appendChild(contenido);
    }
}