// =========================================================
// 1. LÓGICA DE INTERFAZ (UI - FRONTEND)
// =========================================================

// Menú Móvil
const btnMenu = document.querySelector('.btn-menu');
const navLinks = document.querySelector('.nav-links');
if (btnMenu) {
    btnMenu.addEventListener('click', () => navLinks.classList.toggle('active'));
}

// Función optimizada para abrir y cerrar ventanas modales
const configurarModal = (idAbrir, idCerrar, idModal) => {
    const btnAbrir = document.getElementById(idAbrir);
    const btnCerrar = document.getElementById(idCerrar);
    const modal = document.getElementById(idModal);

    if (!btnAbrir || !btnCerrar || !modal) return; // Evita errores si no existe en la página

    btnAbrir.addEventListener("click", () => modal.classList.add("mostrar"));
    btnCerrar.addEventListener("click", () => modal.classList.remove("mostrar"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("mostrar");
    });
};

// Aplicar la función a las ventanas de Login y Registro
configurarModal("btnLogin", "cerrarLogin", "ventanaLogin");
configurarModal("btnRegistrarse", "cerrarRegistro", "ventanaRegistro");


// =========================================================
// 2. CONEXIÓN CON EL BACKEND (API REST - NODE.JS)
// =========================================================

// --- INICIAR SESIÓN ---
const btnEntrar = document.getElementById("btnEntrar");
if (btnEntrar) {
    btnEntrar.addEventListener("click", async (e) => {
        e.preventDefault(); // Evita recargar la página

        const correo = document.getElementById("usuarioCampo").value;
        const password = document.getElementById("passwordCampo").value;

        if (!correo || !password) {
            return alert("Por favor, ingrese correo y contraseña.");
        }

        try {
            // Enviamos los datos en formato JSON a nuestro Backend
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, password })
            });

            const result = await response.json();

            if (response.ok) {
              // 1. Mostramos el mensaje de éxito
              alert("¡Bienvenido, " + result.usuario.nombre + "!");
              
              // 2. Ocultamos el modal
              document.getElementById("ventanaLogin").classList.remove("mostrar");

              // 3. REDIRECCIÓN (Esto era lo que faltaba)
              if (response.ok) {
                alert("¡Bienvenido, " + result.usuario.nombre + "!");
                document.getElementById("ventanaLogin").classList.remove("mostrar");

                // --- NUEVO: Guardamos los datos del usuario en el navegador ---
                localStorage.setItem("usuarioVitalGym", JSON.stringify(result.usuario));
                // --------------------------------------------------------------

                if (result.usuario.rol === 'admin') {
                    window.location.href = "/Paginas/adminDashboard.html";
                } else {
                    window.location.href = "/Paginas/socioPortal.html";
                }
            }
          } else {
              alert(result.mensaje); // "Correo o contraseña incorrectos"
          }
        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor.");
        }
    });
}
// --- REGISTRO PÚBLICO DE USUARIO (CONEXIÓN A BD) ---
const btnRegistrarFinal = document.getElementById("btnRegistrarFinal");
if (btnRegistrarFinal) {
    btnRegistrarFinal.addEventListener("click", async (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById("nombreRegistro").value;
        const correo = document.getElementById("correoRegistro").value;
        const password = document.getElementById("passwordRegistro").value;

        if (!nombre || !correo || !password) {
            return alert("Completa todos los campos para registrarte.");
        }

        try {
            // Mandamos los datos al backend
            const response = await fetch('/api/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, correo, password })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.mensaje); // "¡Cuenta creada exitosamente!"
                document.getElementById("ventanaRegistro").classList.remove("mostrar");
                // Limpiamos los campos
                document.getElementById("nombreRegistro").value = "";
                document.getElementById("correoRegistro").value = "";
                document.getElementById("passwordRegistro").value = "";
            } else {
                alert(result.mensaje); // "Este correo ya está registrado"
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor.");
        }
    });
}