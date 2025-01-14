//hacer que sea un numero
let intentosFallidos = parseInt(localStorage.getItem("intentosFallidos")) || 0;

function validar(event) {
  //hacer que el formulario no se envie de manera predeterminada
  event.preventDefault();

  //si ha llegado a 5 intentos fallidos detener la ejecucion y mostrar mensaje
  if (intentosFallidos >= 5) {
    alert(
      "Has alcanzado el número máximo de intentos fallidos. Intenta nuevamente más tarde."
    );
    return;
  }

  //obtener los valores de los inputs
  const username = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  //hacer solicitud fetch para obtener los usuarios
  fetch("usuarios.json")
    //convertir la respuesta a json
    .then((response) => response.json())
    //buscar el usuario y contraseña en el json
    .then((usuarios) => {
      const usuarioValido = usuarios.find(
        (user) => user.username === username && user.password === password
      );

      //si es valido se guarda en el session storage
      if (usuarioValido) {
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("llave", true);

        //redirigir a la pagina de menu
        window.location.href = "menu.html";
      } else {
        //si no es valido mostrar mensaje de error y sumar intentos fallidos
        alert("Usuario o contraseña incorrectos");
        intentosFallidos++;
        localStorage.setItem("intentosFallidos", intentosFallidos);

        //si llega a 5 intentos fallidos deshabilitar los inputs y el boton de enviar
        if (intentosFallidos >= 5) {
          document.getElementById("usuario").disabled = true;
          document.getElementById("password").disabled = true;
          document.getElementById("email").disabled = true;
          document.querySelector('input[type="submit"]').disabled = true;
        }
      }
    })
    .catch((error) => {
      //si hay un error mostrar mensaje de error
      console.error("Error al cargar usuarios:", error);
      alert("Error en el login, intente nuevamente");
    });
}
