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
btnThemeNight.addEventListener("click", () => {
    //Swichero el Teheme
    document.body.classList.remove("day");
    document.body.classList.add("night");
    //Lo guardo en local storage
    localStorage.setItem("theme", "night");
    //Pongo el boton del theme seleccionado en Active
    btnThemeDay.classList.remove("active");
    btnThemeNight.classList.add("active");
    //Cierro la lista
    themeChangeContainer.classList.remove("open");
});

btnThemeDay.addEventListener("click", () => {
    //Swichero el Teheme
    document.body.classList.remove("night");
    document.body.classList.add("day");
    //Lo guardo en local storage
    localStorage.setItem("theme", "day");
    //Pongo el boton del theme seleccionado en Active
    btnThemeDay.classList.add("active");
    btnThemeNight.classList.remove("active");
    //Cierro la lista
    themeChangeContainer.classList.remove("open");
});