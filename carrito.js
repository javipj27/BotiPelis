//se ejecuta cuando el documento ha sido cargado
document.addEventListener("DOMContentLoaded", () => {
  //recuperar el carrito del local storage
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  //coger el contenedor del carrito
  const container = document.getElementById("carrito");
  //coger el precio total
  const precioTotalElement = document.getElementById("precio-total");
  //coger el boton de finalizar pedido
  const finalizarBtn = document.getElementById("finalizar-pedido");

  //verificar si el carrito esta vacio
  if (carrito.length === 0) {
    //mostrar mensaje de vacio y precio de 0
    container.innerHTML = "<p>El carrito está vacío</p>";
    precioTotalElement.textContent = "Precio Total: 0€";
  } else {
    let precioTotal = 0;

    //recorrer el carrito y mostrar los productos
    carrito.forEach((pelicula) => {
      const peliculaDiv = document.createElement("div");
      peliculaDiv.classList.add("pelicula");

      const poster = document.createElement("img");
      poster.src = pelicula.poster_path;
      poster.alt = pelicula.title;

      const titulo = document.createElement("h3");
      titulo.textContent = pelicula.title;

      const precio = document.createElement("p");
      const precioPelicula = pelicula.price * pelicula.cantidad;
      precio.textContent = `Precio: ${precioPelicula}€`;

      precioTotal += precioPelicula;

      const cantidad = document.createElement("p");
      cantidad.textContent = `Cantidad: ${pelicula.cantidad}`;

      const incrementarBtn = document.createElement("button");
      incrementarBtn.textContent = "+";
      incrementarBtn.classList.add("incrementar");
      //evento para incrementar la cantidad de la pelicula
      incrementarBtn.addEventListener("click", () => {
        pelicula.cantidad++;
        actualizarCarrito(pelicula.id, pelicula.cantidad);
      });

      const decrementarBtn = document.createElement("button");
      decrementarBtn.textContent = "-";
      decrementarBtn.classList.add("decrementar");
      //evento para decrementar la cantidad de la pelicula
      decrementarBtn.addEventListener("click", () => {
        if (pelicula.cantidad > 1) {
          pelicula.cantidad--;
          actualizarCarrito(pelicula.id, pelicula.cantidad);
        } else {
          eliminarDelCarrito(pelicula.id);
        }
      });

      const eliminarBtn = document.createElement("button");
      eliminarBtn.textContent = "Eliminar";
      eliminarBtn.classList.add("eliminar");
      //evento para eliminar la pelicula del carrito
      eliminarBtn.addEventListener("click", () => {
        eliminarDelCarrito(pelicula.id);
      });

      //agregar todos los elementos creados al div de la pelicula
      peliculaDiv.appendChild(poster);
      peliculaDiv.appendChild(titulo);
      peliculaDiv.appendChild(precio);
      peliculaDiv.appendChild(cantidad);
      peliculaDiv.appendChild(incrementarBtn);
      peliculaDiv.appendChild(decrementarBtn);
      peliculaDiv.appendChild(eliminarBtn);
      container.appendChild(peliculaDiv);
    });

    //mostrar el precio total
    precioTotalElement.textContent = `Precio Total: ${precioTotal}€`;

    //evento finalizar pedido
    finalizarBtn.addEventListener("click", () => {
      //si esta vacio mostrar erros
      if (carrito.length === 0) {
        alert("Tu carrito está vacío. No puedes finalizar el pedido.");
      } else {
        //si tiene peliculas en el carrito mostrar mensaje de pedido realizado
        alert("Pedido realizado correctamente");
        //eliminar el carrito del local storage
        localStorage.removeItem("carrito");
        //recargar la pagina
        location.reload();
      }
    });
  }
});

function actualizarCarrito(id, cantidad) {
  //recuperar el carrito del local storage
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  //actualizar la cantidad de la pelicula
  carrito = carrito.map((pelicula) => {
    if (pelicula.id === id) {
      pelicula.cantidad = cantidad;
    }
    return pelicula;
  });
  //guardar el carrito actualizado en el local storage
  localStorage.setItem("carrito", JSON.stringify(carrito));
  location.reload();
}

function eliminarDelCarrito(id) {
  //recuperamos carrito
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  //filtramos el carrito para eliminar la pelicula con el id
  carrito = carrito.filter((pelicula) => pelicula.id !== id);
  //guardamos el carrito actualizado
  localStorage.setItem("carrito", JSON.stringify(carrito));
  location.reload();
}
