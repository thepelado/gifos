const apiKey = "iyHgseyuU5J2JpKKZ495mg5KRf6M0Iqq";

/* Botones comunes */
var btnCreateGif = document.getElementById("btn-create-gif");
var btnMisGifos = document.getElementById("btn-mis-gifos");
var themeChangeContainer = document.getElementById("theme-dropdown");
var btnThemeDropdown = document.getElementById("btn-select-theme");
var btnThemeDay = document.getElementById("theme-day");
var btnThemeNight = document.getElementById("theme-night");

function visitCounter() {
    if (!localStorage.getItem('visita')) {
        localStorage.setItem('visita', parseInt('12765803'));
    }
    let visitas = parseInt(localStorage.getItem('visita')) + 1;
    localStorage.setItem('visita',visitas);
    //
    visitas = visitas.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
    visitas = visitas.split('').reverse().join('').replace(/^[\.]/,'');
    //
    document.getElementById('contador-visitas').innerHTML = document.getElementById('contador-visitas').innerHTML + visitas;
}

/* Acciones de los botones */

/* Create Gif */
btnCreateGif.addEventListener("click", () => {
    location.assign("../upload/upload.html");
});

/* Mis GifoS*/
btnMisGifos.addEventListener("click", () => {
    location.assign("../mis-gifos/mis-gifos.html");
});

/* Dropdown Theme Selector button event assing */
btnThemeDropdown.addEventListener("click", () => {
    if (themeChangeContainer.classList.contains("open"))
    {
        themeChangeContainer.classList.remove("open");
    }
    else
    {
        themeChangeContainer.classList.add("open");
    }
});

/* Theme Change */
btnThemeDay.addEventListener("click", () => {
    //Swicheo el Teheme
    themeChange("day");
    //Pongo el boton del theme seleccionado en Active
    btnThemeNight.classList.remove("active");
    btnThemeDay.classList.add("active");
    //Cierro la lista
    themeChangeContainer.classList.remove("open");
});

btnThemeNight.addEventListener("click", () => {
    //Swicheo el Teheme
    themeChange("night");
    //Pongo el boton del theme seleccionado en Active
    btnThemeDay.classList.remove("active");
    btnThemeNight.classList.add("active");
    //Cierro la lista
    themeChangeContainer.classList.remove("open");
});

function themeChange(newClass) {
    document.body.className = '';
    document.body.classList.add(newClass);
    //Lo guardo en local storage
    localStorage.setItem("theme", newClass);
}


function scrollDown(seccion) {
    let elemento = document.getElementById(seccion);
    window.scrollBy(0, elemento.offsetTop);
}