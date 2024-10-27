// function toggleMenu(){
//     const menu = document.querySelector(".menu-links");
//     const icon = document.querySelector(".hamburger-icon");
//     menu.classList.toggle("open");
//     icon.classList.toggle("open");
// }

function toggleMenu(menuSelector = ".menu-links", iconSelector = ".hamburger-icon") {
    const menu = document.querySelector(menuSelector);
    const icon = document.querySelector(iconSelector);
    if (menu && icon) {
        menu.classList.toggle("open");
        icon.classList.toggle("open");
    }
}
