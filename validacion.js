var llave = false;

function validar(event) {
    event.preventDefault();  // Evitar que el formulario se envíe de forma tradicional

    var username = document.getElementById("usuario").value;  // Obtener el nombre de usuario
    var password = document.getElementById("password").value;  // Obtener la contraseña
    var email = document.getElementById("email").value;  // Obtener el email

    // Preparamos los datos para el login
    var formData = {
        username: username,
        password: password
    };

    // Llamada a la API de login
    fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Si el login es correcto, guardamos en sessionStorage y redirigimos
            if (data.token) {
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('llave', true);
                sessionStorage.setItem('email', email);

                window.location.href = 'menu.html';  // Redirigir a la página deseada
            } else {
                alert("Usuario o contraseña incorrectos");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error en el login, intente nuevamente");
        });
}
