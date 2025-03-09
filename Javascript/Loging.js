document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Obtener valores de los campos
        const usuario = document.querySelector(".form-control[type='text']").value.trim();
        const contraseña = document.querySelector(".form-control[type='password']").value.trim();

        // Validación de campos vacíos
        if (usuario === "" || contraseña === "") {
            mostrarMensaje("Por favor, complete todos los campos", "error");
            return;
        }

        // Simulación de autenticación (puedes reemplazar esto con una API real)
        if (usuario === "admin" && contraseña === "1234") {
            mostrarMensaje("Inicio de sesión exitoso", "success");
            setTimeout(() => {
                window.location.href = "MenuPrincipal.js.html"; // Redirige a otra página
            }, 2000);
        } else {
            mostrarMensaje("Usuario o contraseña incorrectos", "error");
        }
    });

    function mostrarMensaje(mensaje, tipo) {
        let mensajeBox = document.querySelector(".mensaje-box");

        if (!mensajeBox) {
            mensajeBox = document.createElement("div");
            mensajeBox.classList.add("mensaje-box");
            document.body.appendChild(mensajeBox);
        }

        mensajeBox.textContent = mensaje;
        mensajeBox.className = `mensaje-box ${tipo}`;

        setTimeout(() => {
            mensajeBox.textContent = "";
            mensajeBox.className = "mensaje-box";
        }, 3000);
    }
});
