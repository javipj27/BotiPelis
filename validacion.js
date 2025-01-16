// Inicializar los intentos fallidos desde localStorage
let intentosFallidos = parseInt(localStorage.getItem("intentosFallidos")) || 0;

function validar(event) {
  // Prevenir el envío predeterminado del formulario
  event.preventDefault();

  // Verificar si se alcanzaron 5 intentos fallidos
  if (intentosFallidos >= 5) {
    alert(
      "Has alcanzado el número máximo de intentos fallidos. Intenta nuevamente más tarde."
    );
    return;
  }

  // Obtener los valores de los inputs
  const username = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  // Hacer solicitud fetch a JSON Server para validar usuario y contraseña
  fetch(`http://localhost:3000/usuarios?username=${username}&password=${password}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      return response.json(); // Convertir la respuesta a JSON
    })
    .then((usuarios) => {
      // Verificar si se encontró un usuario válido
      if (usuarios.length > 0) {
        const usuarioValido = usuarios[0]; // Usuario encontrado

        // Guardar datos en sessionStorage
        sessionStorage.setItem("username", usuarioValido.username);
        sessionStorage.setItem("email", usuarioValido.email);
        sessionStorage.setItem("llave", true);

        // Redirigir a la página de menú
        window.location.href = "menu.html";
      } else {
        // Si no es válido, mostrar mensaje y sumar intentos fallidos
        alert("Usuario o contraseña incorrectos");
        intentosFallidos++;
        localStorage.setItem("intentosFallidos", intentosFallidos);

        // Si llega a 5 intentos fallidos, deshabilitar los inputs y botón
        if (intentosFallidos >= 5) {
          document.getElementById("usuario").disabled = true;
          document.getElementById("password").disabled = true;
          document.querySelector('input[type="submit"]').disabled = true;
        }
      }
    })
    .catch((error) => {
      console.error("Error al realizar la solicitud:", error);
      alert("Error en el login, intente nuevamente");
    });
}

// Asignar el evento "submit" al formulario
document.getElementById("loginForm").addEventListener("submit", validar);
