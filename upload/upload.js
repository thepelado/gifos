const userName = "thepelado88";
const subidaEndPoint = 'https://upload.giphy.com/v1/gifs?';
const buscarProId = 'https://api.giphy.com/v1/gifs/';

var btnComenzar = document.getElementById("btn-comenzar");
var btnCancelar = document.getElementById("btn-cancelar");
var video = document.getElementById("video");
var videoPreview = document.getElementById("video-preview");
var btnGrabar = document.getElementById("btn-grabar-comenzar");
var btnFinalizar = document.getElementById("btn-grabar-finalizar");
var tiempo = document.getElementById("tiempo");
var tiempoPreview = document.getElementById("tiempo-preview");
var btnRepetirProceso = document.getElementById("btn-repetir-captura");
var btnSubirGifOs = document.getElementById("btn-subir-gifo");
var btnDescargarGifOs = document.getElementById("btn-descargar-gifo");
var btnCopiarGifOs = document.getElementById("btn-descargar-gifo");

var grabacion;
var miCamara;
var horaDeInicio;
var horaDeFin;
var duracion;
var blob;
var misGifOs = [];

window.onload = function() {
    //Registro Visita
    visitCounter();

    //Fijo el theme seleccionado
    if (localStorage.getItem("theme")) //Si hay theme
    {
        let theme = localStorage.getItem("theme");
        document.body.classList.add(theme);
    }
    else
    {
        document.body.classList.add("day");
    }
};

/* Btn Cancelar */
btnCancelar.addEventListener("click", () => {
    location.href = "../index.html";
});

/* Btn Comenzar */
btnComenzar.addEventListener("click", () => {
    document.getElementById("primer-paso").classList.add("hidden");
    /*Restablezco el titulo del segundo bloque por si grabe y vuelvo a iniciar*/
    document.getElementById("titulo-segundo-paso").innerHTML = "Un Chequeo Antes de Empezar";
    document.getElementById("segundo-paso").classList.remove("hidden");
    getStreamAndRecord();
});

function cancelarProceso() {    
    //
    btnGrabar.classList.remove("hidden");
    btnFinalizar.classList.add("hidden");
    tiempo.classList.add("hidden");
    document.getElementById("segundo-paso").classList.add("hidden");
    //
    document.getElementById("tercer-paso").classList.add("hidden");
    //
    document.getElementById("primer-paso").classList.remove("hidden");
}

/* Obtener video */
function getStreamAndRecord () { 
    navigator.mediaDevices.getUserMedia({    
        audio: false,    
        video: {   
            video: true, 
            height: { max: 480 }    
        }    
    })
    .then(function(stream) {
        //Guardo el stream del video en una variable para poder grabarlo
        miCamara = stream;
        video.srcObject = stream;    
        video.play()    
    })
    .catch(error => {
        alert ("Necesitás una camara para crear tus gifOs");
        cancelarProceso();
    });
}

/* Comenzar a Grabar */
btnGrabar.addEventListener("click", () => {
    /* Oculto este boton y muestro el de parar*/
    btnGrabar.classList.add("hidden");
    btnFinalizar.classList.remove("hidden");
    tiempo.classList.remove("hidden");

    /*Cambio el titulo de la ventana*/
    document.getElementById("titulo-segundo-paso").innerHTML = "Capturando Tu Guifo";
    
    /* Creo el elemento que va a guardar la grabacion */
    grabacion = crearGrabador(miCamara);
    grabacion.startRecording(); //uso la funcion de la libreria
    horaDeInicio = new Date().getTime();//defino el momento en que comence a grabar
    calcularTiempoGrabacion();
})

function crearGrabador(transmision) {
    return RecordRTC(transmision, {
        disableLogs: true, //tiene logs automaticos
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        timeSlice: 1000,
    });
}

function calcularTiempoGrabacion() {
    //Si no estoy grabando nada...me voy
    if (!grabacion) {
        return;
    }
    tiempo.innerText = calcularDuracion((new Date().getTime() - horaDeInicio) / 1000);
    setTimeout(calcularTiempoGrabacion, 1000); // Cada un segundo voy actualizando el temporizador
}

function calcularDuracion(segundos) {

    var hr = Math.floor(segundos / 3600);
    var min = Math.floor((segundos - (hr * 3600)) / 60);
    var seg = Math.floor(segundos - (hr * 3600) - (min * 60));

    min = (min < 10)? "0" + min : min;
    seg = (seg < 10)? "0" + seg : seg;

    if (hr <= 0) {
        return min + ':' + seg;
    }

    return hr + ':' + min + ':' + seg;
}

/* Repetir el proceso */
btnRepetirProceso.addEventListener("click", () => {
    document.getElementById("tercer-paso").classList.add("hidden");
    //
    btnGrabar.classList.remove("hidden");
    btnFinalizar.classList.add("hidden");
    tiempo.classList.add("hidden");
    btnComenzar.click();
})

/* Finalizar Grabacion */
btnFinalizar.addEventListener("click", terminarGrabacion);

function terminarGrabacion() {

    //Oculto el segundo paso
    document.getElementById("segundo-paso").classList.add("hidden");
    //Muestro el tercer paso
    document.getElementById("tercer-paso").classList.remove("hidden");

    horaDeFin = new Date().getTime();
    grabacion.stopRecording(() => {
        blob = grabacion.getBlob(); //Guardo los datos planos para subirlos a futuro        
        videoPreview.src = grabacion.toURL(); //muestro en un elemento video el resultado

        //reseteo el elemento que graba
        grabacion.destroy();
        grabacion = null;

        //Libero la camara
        miCamara.getTracks().forEach(function(track) {
            track.stop();
        });
    });
}

/* Subir gif */
btnSubirGifOs.addEventListener("click", subirGif);

function subirGif() {

    //mostar las pantallas correspondientes
    document.getElementById("tercer-paso").classList.add("hidden");
    document.getElementById("cuarto-paso").classList.remove("hidden");

    //Creo un objeto FormData para enviar en él lo que grabe
    data = new FormData();
    data.append('file', blob, 'misGif.gif');
    
    let URL = subidaEndPoint + '&api_key=' + apiKey + '&username=' + userName;

    // 1. Create a new XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', URL);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.upload.addEventListener("progress", function (event) {
        if (event.lengthComputable) {
            //Me quedo con un digito solamente del % de subida para hacer equivalencia con mi barra
            var complete = (event.loaded / event.total * 100 | 0);
            pintarBarra(complete);
        }
    });
    
    xhr.send(data);

    // 4. This will be called after the response is received
    xhr.onload = function() {
        if (xhr.status != 200) { // analyze HTTP status of the response
            alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        } else { // show the result
            let id = xhr.response.data.id;
            document.getElementById("cuarto-paso").classList.add("hidden");
            document.getElementById("quinto-paso").classList.remove("hidden");
            guandarGifEnLocalStorage(id);
        }
    };

    xhr.onerror = function() {
        alert("Request failed");
    };
}

function pintarBarra(porcentaje) {
    let barra = document.getElementById("barra-upload");
    let items = barra.getElementsByTagName("li");
    //Son 24 cuadraditos, asi que hago la equivalencia
    porcentaje = Math.ceil((porcentaje * 24) /100);
    for (let i = 0; i < porcentaje; ++i) {
        if (!items[i].classList.contains("completa"))
        {
            items[i].classList.add("completa");
        }
    }
}

function guandarGifEnLocalStorage(id) {
    //traigo el gif conpleto con este id
    fetch(buscarProId + id + '?' + '&api_key=' + apiKey)
    .then(response => {
        return response.json();
    })
    .then(dataGif => {
        let url = dataGif.data.images.downsized.url
        document.getElementById("upload-result").src = url;
        
        //guardar en elnace en el boton 
        btnCopiarGifOs.setAttribute("value", url);


        //me fijo si hay algo guardado
        if (localStorage.getItem('gifs')) {
            //Reviso si ya no tengo algo grabado y lo subo al arreglo de mis gifOs
            misGifOs = JSON.parse(localStorage.getItem('gifs'));
            misGifOs.push(url);
            localStorage.setItem('gifs', JSON.stringify(misGifOs));
        } else {
            misGifOs.push(url);
            localStorage.setItem('gifs', JSON.stringify(misGifOs));
        }
    });
}

/* Descargar Gif */
btnDescargarGifOs.addEventListener("click", descargarGif);
function descargarGif() {
    invokeSaveAsDialog(blob, 'migif.gif');
}

/* Copiar al portapapeles */
btnCopiarGifOs.addEventListener('click', function(event) {
    let text = btnCopiarGifOs.getAttribute('value');
    navigator.clipboard.writeText(text).then(function() {
        /* clipboard successfully set */
        console.log("copiado con éxito");
    });
});