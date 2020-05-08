/* End Points */
const searchEndpoint = 'https://api.giphy.com/v1/gifs/search?q=';
const trendingEndpoint = 'https://api.giphy.com/v1/gifs/trending';
const randomEndpoint = 'https://api.giphy.com/v1/gifs/random';
const suggestionsURL = 'https://api.giphy.com/v1/tags/related';

var inputBusqueda = document.getElementById("txt-buscar");
var btnBuscar = document.getElementById("btn-buscar");

var arraySuggestions = new Array();
var amountSuggestions = 4;
var amountTrendings = 12;

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
    for (let index = 0; index < amountSuggestions; index++) {
        getRandomResult()
        .then (resdata => {
            let datos = resdata.data;
            arraySuggestions.push({ url: datos.images.original.url, titulo: datos.title });
            if (arraySuggestions.length == amountSuggestions) {
                //Maqueto el contenido
                insertRandomResult();
            }
        })
        .catch(error => {
            console.log(error);
        });
    }
    getTrendingResults()
        .then(data => {
            insertTrendingResults(data);
        })
        .catch(error => {
            console.log(error);
        });

    //Muestro el historial de las busquedas
    updateSearchHistory();
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
            return resdata;
        })
        .catch(error => {
            return error;
        });
    return found;
}

function insertRandomResult() {

    //Borro si tiene contenido
    let container = document.getElementById("resultado-random");  
    container.innerHTML = "";

    //Maqueto el contenido
    for(let i=0; i < arraySuggestions.length; i++) {

        //Limpio el titulo
        let textoTitulo = getTagsForTitle(arraySuggestions[i].titulo);
        let textoBoton = textoTitulo.replace("#", " ");
        // Creo el Contenedor del elemento
        let elemento = document.createElement("div");
        elemento.classList.add("container", "sugerido");
          
        elemento.innerHTML =
            '<div class="etiqueta gradient">' +
            '<p> ' + textoTitulo + '  </p>' +
            '<img class="btn-cerrar" onclick="removeRandomSuggestion('+i+');" src = "../assets/images/close.svg" alt = "#" > ' +
            '</div><img class="gif" src=' + arraySuggestions[i].url + ' alt="'+ textoTitulo +'" >' +
            '<button class="btn btn-ver-mas" onClick="getSearchResults(\''+ textoBoton +'\');">' +
            '<span class="text">Ver más...</span>' +
            '</button>';

        container.appendChild(elemento);
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
    arraySuggestions.splice(index,1);
    //Solicito uno nuevo
    getRandomResult()
    .then (resdata => {
        let datos = resdata.data;
        arraySuggestions.push({ url: datos.images.original.url, titulo: datos.title });
    })
    .catch(error => {
        console.log(error);
    });
}

/* Trending */
function getTrendingResults() {
    const found = fetch(trendingEndpoint + '?api_key=' + apiKey)
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

function insertTrendingResults(array) {

    //Borro si tiene contenido
    let container = document.getElementById("resultado-tendencias");  
    let cont = 0;
    let contDobles = 0;
    for (let i=0; i < array.length && cont < amountTrendings; i++) {
        //Maqueto el contenido
        let clase_doble = '';
        if (contDobles < 4 && (array[i].images.original.width >= (array[i].images.original.height * 1.4)))
        {
            if (cont + 2 <= amountTrendings) {
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

    if (valor.length > 0) {
        document.getElementById("btn-buscar").disabled = false;
        getSuggestions(valor)
            .then( respuesta => updateSuggestions(respuesta));
    } else {
        document.getElementById("btn-buscar").disabled = true;
        //Oculto busqueda
        document.getElementById("section-resultados-busqueda").classList.add("hidden");
        //Blanqueo la lista de sugerencias y los botones        
        document.getElementById("lista-sugerencias").innerHTML = "";
        document.getElementById("lista-btn-historial").innerHTML = "";
        //Muestro sugerencias y tendencias
        document.getElementById("section-sugerencias").classList.remove("hidden");
        document.getElementById("section-tendencias").classList.remove("hidden");
    }
});

inputBusqueda.addEventListener("keypress", (key) => {
    if (key.keyCode === 13) {
        event.preventDefault();
        let termino = inputBusqueda.value;
        getSearch(termino)
            .then( respuesta => {
                //Oculto tendencias y sugerencias
                document.getElementById("section-sugerencias").classList.add("hidden");
                document.getElementById("section-tendencias").classList.add("hidden");
                //Inserto los resultados
                insertSearchResults(termino, respuesta);
                //Limpio las sugerencias
                let container = document.getElementById("lista-sugerencias");
                container.innerHTML = "";
                return respuesta;
            })
            .then (respuesta => {
                saveSearch(termino, respuesta);
            });
        return false;
    }
});

function getSuggestions(palabra) {
    const found = fetch(suggestionsURL + '/' + palabra + '?api_key=' + apiKey)
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

function updateSuggestions(obj) {

    let valor = inputBusqueda.value.trim();

    if (valor.length > 0) { //Reviso por las dudas si borre rapido en el input
        let resultado = obj.slice(0, amountSuggestions-1);
        //Borro si tiene contenido y la muestro
        let container = document.getElementById("lista-sugerencias");
        container.innerHTML = "";
        container.classList.remove("hidden");

        //Armo los botones con las sugerencias
        for (let i=0; i < amountSuggestions-1; i++)
        {
            //Maqueto el contenido
            let contenido = document.createElement("div");
            contenido.setAttribute("class", "sugerencia");
            contenido.innerHTML = '<button name="btn-opt-sugerido" type="button" class="btn btn-sugerido" onClick="getSearchResults(\''+resultado[i].name+'\')">' +
                                '<span>'+ resultado[i].name +'</span>' +
                                '</button>';
            container.appendChild(contenido);
        }
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

function getSearchResults(termino) {
    getSearch(termino)
        .then( respuesta => {
            //Oculto tendencias y sugerencias
            document.getElementById("section-sugerencias").classList.add("hidden");
            document.getElementById("section-tendencias").classList.add("hidden");
            //Inserto los resultados
            insertSearchResults(termino, respuesta);
            //Limpio las sugerencias
            let container = document.getElementById("lista-sugerencias");
            container.innerHTML = "";
            return respuesta;
        })
        .then (respuesta => {
            saveSearch(termino, respuesta);
        });
}

function saveSearch(term, searchResult)
{
    let newItem = { term, result: searchResult };
    if (localStorage.getItem("search-results")) //Si hay theme
    {
        let searchesHistory = JSON.parse(localStorage.getItem("search-results"));
        searchesHistory.unshift(newItem);
        localStorage.setItem("search-results", JSON.stringify(searchesHistory));
    }
    else
    {
        localStorage.setItem("search-results", JSON.stringify([newItem]));
    }
    updateSearchHistory();
}

function updateSearchHistory() {
    let searchesHistory = JSON.parse(localStorage.getItem("search-results"));
    if (searchesHistory && searchesHistory.length > 0) {
        //Borro si tiene contenido y la muestro
        let container = document.getElementById("lista-btn-historial");
        container.innerHTML = "";

        //Armo los botones con las sugerencias
        for (let i=0; i < searchesHistory.length; i++)
        {
            let titulo = getTagsForTitle(searchesHistory[i].term);
            //Maqueto el contenido
            let contenido = document.createElement("div");
            contenido.innerHTML = '<button name="btn-opt-sugerido" type="button" class="btn btn-ver-mas" onClick="getSearchHistoryResults(\''+searchesHistory[i].term+'\')">' +
                                '<span class="text">'+ titulo +'</span>' +
                                '</button>';
            container.appendChild(contenido);
        }
    }
}

function getSearchHistoryResults(term) {

    let searchesHistory = JSON.parse(localStorage.getItem("search-results"));
    let historial = searchesHistory.find(query => query.term == term);
    if (historial) {
        insertSearchResults(historial.term, historial.result);
    }
}

function insertSearchResults(criterio, resultado) {

    inputBusqueda.value = criterio;
    btnBuscar.disabled = false;

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
    scrollDown("section-resultados-busqueda");
}