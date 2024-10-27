// function toggleMenu(){
//     const menu = document.querySelector(".menu-links");
//     const icon = document.querySelector(".hamburger-icon");
//     menu.classList.toggle("open");
//     icon.classList.toggle("open");
// }

const loggerMiddleware = require('./Middleware/loggerMiddleware').default;

const express = require('express');
const app = express();

// Use the logger middleware
app.use(loggerMiddleware);

// above code is added for middleware assignment

function toggleMenu(menuSelector = ".menu-links", iconSelector = ".hamburger-icon") {
    const menu = document.querySelector(menuSelector);
    const icon = document.querySelector(iconSelector);
    if (menu && icon) {
        menu.classList.toggle("open");
        icon.classList.toggle("open");
    }
}
