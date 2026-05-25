// Detectar la pagina
let rutaBase = "";

if (window.location.pathname.includes("/Paginas/")) {
  rutaBase = "../";
} else {
  rutaBase = "";
}



// Arreglo de entrenadores
const entrenadores = [];
const totalEntrenadores = 4;

for (let i = 1; i <= totalEntrenadores; i++) {
  entrenadores.push({
    imagen: `Imagenes/Entrenadores/Entrenador-${i}.jpg`,
    nombre: `Entrenador ${i}`
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedorEntrenadores");
  if (!contenedor) return;

  entrenadores.forEach(ent => {
    const card = document.createElement("div");
    card.classList.add("tarjeta-entrenador");

    card.innerHTML = `
      <img src="${rutaBase}${ent.imagen}" alt="${ent.nombre}" class="imagen-entrenador">
    `;

    contenedor.appendChild(card);
  });
});



// Arreglo para navegacion
const menu = [
  { nombre: "Inicio",      link: "index.html" },
  { nombre: "Nosotros",    link: "Paginas/Nosotros.html" },
  { nombre: "Experiencia", link: "Paginas/Experiencia.html" },
  { nombre: "Clases",      link: "Paginas/Clases.html" },
  { nombre: "Membresías",  link: "Paginas/Membresias.html" },
  { nombre: "Contacto",    link: "Paginas/Contacto.html" }
];

document.addEventListener("DOMContentLoaded", () => {
  const contenedorNav = document.getElementById("navLinks");
  if (!contenedorNav) return;

  menu.forEach(item => {
    const enlace = document.createElement("a");
    enlace.href = rutaBase + item.link;
    enlace.textContent = item.nombre;
    enlace.classList.add("enlace-nav");

    contenedorNav.appendChild(enlace);
  });
});