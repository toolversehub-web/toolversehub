// ===========================
// Hamburger Menu
// ===========================

const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");

menuToggle.addEventListener("click", function () {

    navbar.classList.toggle("active");

});

// Close menu after clicking a link

const navLinks = document.querySelectorAll("#navbar a");

navLinks.forEach(link => {

    link.addEventListener("click", function () {

        navbar.classList.remove("active");

    });

});