var misGifOs = [];

window.onload = function() {
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

    showMyGifos();
};

function showMyGifos() {
    if (localStorage.getItem("gifs"))
    {
        let container = document.getElementById("resultado-mis-gifos");
        misGifOs = JSON.parse(localStorage.getItem("gifs"));
        misGifOs.forEach(gifo => {
            if (gifo) {
                //Maqueto el contenido
                let contenido = document.createElement("div");
                contenido.setAttribute("class", "item");
                contenido.innerHTML =
                    '<div class="container">'+
                    '<img src=' + gifo + ' alt="#" >' +
                    '</div>';
                container.appendChild(contenido);
            }
        });
    }
}