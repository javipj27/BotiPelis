var peliculasMostradas = 0;

// cargar peliculas
function cargarPeliculas() {
  //obtener las peliculas.json
  fetch("peliculas.json")
    //si esta bien, pasar a formato json
    .then((response) => response.json())
    //pasamos el json a inicializarPeliculas
    .then((data) => inicializarPeliculas(data.results))
    //si da fallo se muestra
    .catch((error) => console.error("Error al cargar las películas:", error));
}

// iniciar las peliculas
function inicializarPeliculas(peliculas) {
  //se coge el contenedor por id
  var container = document.getElementById("lista-peliculas");

  //inicial de peliculas
  actualizarPeliculas(peliculas, container, true);

  //desplazamiento de la pagina scroll
  window.addEventListener("scroll", function () {
    //si ha llegado al final de la pagina con margen de 100px y aun no estan todas las pelis
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      peliculasMostradas < peliculas.length
    ) {
      //se actualiza
      actualizarPeliculas(peliculas, container, false);
    }
  });

  //si cambia el ordenar precio se ordena
  document
    .getElementById("ordenar-precio")
    .addEventListener("change", function () {
      ordenarPeliculas(peliculas, container);
    });

  //si cambia el filtro por categoria se filtra
  document
    .getElementById("aplicar-filtro")
    .addEventListener("click", function () {
      filtrarPeliculas(peliculas, container);
    });
}

// ordenar peliculas
function ordenarPeliculas(peliculas, container) {
  //obtienes el valor
  var orden = document.getElementById("ordenar-precio").value;
  //se ordena
  peliculas.sort(function (a, b) {
    //si la opcion es asc se ordena de menor a mayor
    return orden === "asc" ? a.price - b.price : b.price - a.price;
  });
  //resetea la cantidad de peliculas y actualiza de nuevo
  peliculasMostradas = 0;
  actualizarPeliculas(peliculas, container, true);
}

// filtrar por categoria
function filtrarPeliculas(peliculas, container) {
  //cogemos el valor del select
  var categoria = document.getElementById("filtrar-categoria").value;
  //si es all, no se muestran las peliculas
  //si es otra, se filtran las peliculas que tienen esa categoria
  var peliculasFiltradas =
    categoria === "all"
      ? peliculas
      : peliculas.filter(function (pelicula) {
          return (
            pelicula.genre_names && pelicula.genre_names.includes(categoria)
          );
        });

  //resetea cantidad y actualiza
  peliculasMostradas = 0;
  actualizarPeliculas(peliculasFiltradas, container, true);
}

// actualizar las peliculas
function actualizarPeliculas(peliculasFiltradas, container, limpiar) {
  //vacia el contenedor
  if (limpiar) {
    container.innerHTML = "";
  }

  //coge 8 peliculas y las muestra
  peliculasFiltradas
    .slice(peliculasMostradas, peliculasMostradas + 8)
    .forEach(function (pelicula) {
      //crea elemento para cada pelicula y lo añade al contenedor
      crearPelicula(pelicula, container);
    });

  //incrementa la cantidad de peliculas mostradas en 8
  peliculasMostradas += 8;
}

// crear una pelicula
function crearPelicula(pelicula, container) {
  //crea div
  var peliculaDiv = document.createElement("div");
  //añade clase pelicula al div
  peliculaDiv.classList.add("pelicula");

  //crea imagen, titulo, precio y botones
  var img = crearImagen(pelicula);
  var titulo = crearTitulo(pelicula);
  var precio = crearPrecio(pelicula);
  var botonesDiv = crearBotones(pelicula);

  //añade imagen, titulo, precio y botones al div
  peliculaDiv.appendChild(img);
  peliculaDiv.appendChild(titulo);
  peliculaDiv.appendChild(precio);
  peliculaDiv.appendChild(botonesDiv);

  //añade el div al contenedor
  container.appendChild(peliculaDiv);
}

// imagen
function crearImagen(pelicula) {
  var img = document.createElement("img");
  img.src = pelicula.poster_path;
  img.alt = pelicula.title;
  return img;
}

// titulo
function crearTitulo(pelicula) {
  //crea h3
  var titulo = document.createElement("h3");

  //añade el titulo de la pelicula
  titulo.textContent = pelicula.title;
  return titulo;
}

// precio
function crearPrecio(pelicula) {
  //crea p
  var precio = document.createElement("p");

  //añade el precio de la pelicula
  precio.textContent = "Precio: " + pelicula.price + "€";
  return precio;
}

// crear los botones
function crearBotones(pelicula) {
  //crea div para los botones
  var botonesDiv = document.createElement("div");
  //añade clase botones al div
  botonesDiv.classList.add("botones");

  //crea boton ver detalles
  var btnDetalles = document.createElement("button");
  //añade clase ver-detalles al boton
  btnDetalles.classList.add("ver-detalles");
  //texto al boton
  btnDetalles.textContent = "Ver detalles";

  //evento para ver detalles cuando le des click al boton
  btnDetalles.addEventListener("click", function () {
    mostrarDetalles(pelicula);
  });

  //crea boton añadir al carrito
  var btnCarrito = document.createElement("button");
  //añade clase anadir-carrito al boton
  btnCarrito.classList.add("anadir-carrito");
  //texto al boton
  btnCarrito.textContent = "Añadir al carrito";
  //evento para añadir al carrito cuando le des click al boton
  btnCarrito.addEventListener("click", function () {
    anadirAlCarrito(pelicula);
  });

  //añade botones al contenedor
  botonesDiv.appendChild(btnDetalles);
  botonesDiv.appendChild(btnCarrito);

  return botonesDiv;
}

// ver los detalles de la pelicula
function mostrarDetalles(pelicula) {
  //coge el modal por id
  var modal = document.getElementById("modal");
  //añade la imagen, titulo, precio
  modal.querySelector("#modal-img").src = pelicula.poster_path;
  modal.querySelector("#modal-title").textContent = pelicula.title;
  modal.querySelector("#modal-price").textContent =
    "Precio: $" + pelicula.price;

  //añade la descripcion
  modal.querySelector("#modal-overview").textContent = pelicula.overview;
  //configura el añadir carrito
  modal.querySelector("#modal-add-to-cart").onclick = function () {
    //añade la pelicula y cierra el modal
    anadirAlCarrito(pelicula);
    modal.style.display = "none";
  };

  //muestra el modal
  modal.style.display = "flex";

  //cerrar el modal
  modal.querySelector(".modal__close").onclick = function () {
    modal.style.display = "none";
  };
}

// Añadir pelicula al carrito
function anadirAlCarrito(pelicula) {
  //lo recupera del local storage o crea array vacio
  var carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  //busca si la pelicula esta en el carrito
  var existente = carrito.find(function (item) {
    return item.id === pelicula.id;
  });
  if (existente) {
    //si esta, incrementa la cantidad
    existente.cantidad++;
  } else {
    //si no esta, añade la pelicula al carrito
    carrito.push(Object.assign({}, pelicula, { cantidad: 1 }));
  }
  //guarda el carrito en el local storage
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function buscarTitulo() {
  var buscarTitulo = document.getElementById("buscar-titulo").value.toLowerCase();
  var container = document.getElementById("lista-peliculas");

  fetch("peliculas.json")
    .then((response) => response.json())
    .then((data) => {
      var peliculasFiltradas = data.results.filter((pelicula) =>
        pelicula.title.toLowerCase().includes(buscarTitulo)
      );
      peliculasMostradas = 0;
      actualizarPeliculas(peliculasFiltradas, container, true);
    })
}



// cargar las peliculas al cargar la pagina
window.onload = cargarPeliculas;
