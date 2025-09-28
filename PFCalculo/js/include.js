// include.js
function includeHTML() {
    document.querySelectorAll("[data-include]").forEach(el => {
        let file = el.getAttribute("data-include");
        fetch(file)
            .then(response => response.text())
            .then(data => {
                el.innerHTML = data;

                // 🔹 Activar menú después de cargar el header
                if (file.includes("header.html")) {
                    activarMenu();
                }
            });
    });
}

function activarMenu() {
    const links = document.querySelectorAll(".nav-menu .nav-link");
    const currentPage = window.location.pathname.split("/").pop();

    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
}

window.onload = includeHTML;
