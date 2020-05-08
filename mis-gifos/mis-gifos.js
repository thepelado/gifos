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

    showMyGifos();
};

function showMyGifos() {
    if (localStorage.getItem("gifs"))
    {
        document.getElementById("section-mis-gifos").classList.remove("hidden");
        let container = document.getElementById("resultado-mis-gifos");
        misGifOs = JSON.parse(localStorage.getItem("gifs"));
        misGifOs.forEach(gifo => {
            if (gifo) {
                let content = document.createElement("div");
                content.setAttribute("class", "item");
                content.innerHTML =
                    '<div class="container">'+
                    '<img src=' + gifo + ' alt="#" >' +
                    '</div>';
                container.appendChild(content);
            }
        });
    }
    else {
        document.getElementById("mensaje").classList.remove("hidden");
    }
}