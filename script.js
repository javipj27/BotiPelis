//cargar peliculas
function cargarPeliculas() {
    fetch('peliculas.json')
      .then(response => response.json())
      .then(data => inicializarPeliculas(data.results))
      .catch(error => console.error('Error al cargar las películas:', error));
  }
  
  // iniciar peliculas
  function inicializarPeliculas(peliculas) {
    var container = document.getElementById('lista-peliculas');
    var peliculasPorPagina = 8;
    var peliculasMostradas = 0;
  
    actualizarPeliculas(peliculas, peliculasMostradas, container, true);
  
    window.addEventListener('scroll', function() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && peliculasMostradas < peliculas.length) {
        actualizarPeliculas(peliculas, peliculasMostradas, container, false);
      }
    });
  
    document.getElementById('ordenar-precio').addEventListener('change', function() {
      ordenarPeliculas(peliculas, peliculasMostradas, container);
    });
    document.getElementById('aplicar-filtro').addEventListener('click', function() {
      filtrarPeliculas(peliculas, peliculasMostradas, container);
    });
  }
  
  // ordenar peliculas 
  function ordenarPeliculas(peliculas, peliculasMostradas, container) {
    var orden = document.getElementById('ordenar-precio').value;
    peliculas.sort(function(a, b) {
      return orden === 'asc' ? a.price - b.price : b.price - a.price;
    });
    peliculasMostradas = 0;
    actualizarPeliculas(peliculas, peliculasMostradas, container, true);
  }
  
  // filtrar por categoria
  function filtrarPeliculas(peliculas, peliculasMostradas, container) {
    var categoria = document.getElementById('filtrar-categoria').value;
    var peliculasFiltradas = categoria === 'all' 
      ? peliculas 
      : peliculas.filter(function(pelicula) {
          return pelicula.genre_names && pelicula.genre_names.includes(categoria);
        });
  
    peliculasMostradas = 0;
    actualizarPeliculas(peliculasFiltradas, peliculasMostradas, container, true);
  }
  
  // actualizar peliculas 
  function actualizarPeliculas(peliculasFiltradas, peliculasMostradas, container, limpiar) {
    if (limpiar) {
      container.innerHTML = '';
    }
    peliculasFiltradas.slice(peliculasMostradas, peliculasMostradas + 8)
      .forEach(function(pelicula) {
        crearPelicula(pelicula, container);
      });
  
    peliculasMostradas += 8;
  }
  
  //crear una pelicula
  function crearPelicula(pelicula, container) {
    var peliculaDiv = document.createElement('div');
    peliculaDiv.classList.add('pelicula');
  
    var img = crearImagen(pelicula);
    var titulo = crearTitulo(pelicula);
    var precio = crearPrecio(pelicula);
    var botonesDiv = crearBotones(pelicula);
  
    peliculaDiv.appendChild(img);
    peliculaDiv.appendChild(titulo);
    peliculaDiv.appendChild(precio);
    peliculaDiv.appendChild(botonesDiv);
  
    container.appendChild(peliculaDiv);
  }
  
  //imagen
  function crearImagen(pelicula) {
    var img = document.createElement('img');
    img.src = pelicula.poster_path;
    img.alt = pelicula.title;
    return img;
  }
  
  // titulo
  function crearTitulo(pelicula) {
    var titulo = document.createElement('h3');
    titulo.textContent = pelicula.title;
    return titulo;
  }
  
  //precio
  function crearPrecio(pelicula) {
    var precio = document.createElement('p');
    precio.textContent = 'Precio: ' + pelicula.price + '€';
    return precio;
  }
  
  //para crear los botones
  function crearBotones(pelicula) {
    var botonesDiv = document.createElement('div');
    botonesDiv.classList.add('botones');
  
    var btnDetalles = document.createElement('button');
    btnDetalles.classList.add('ver-detalles');
    btnDetalles.textContent = 'Ver detalles';
    btnDetalles.addEventListener('click', function() {
      mostrarDetalles(pelicula);
    });
  
    var btnCarrito = document.createElement('button');
    btnCarrito.classList.add('anadir-carrito');
    btnCarrito.textContent = 'Añadir al carrito';
    btnCarrito.addEventListener('click', function() {
      anadirAlCarrito(pelicula);
    });
  
    botonesDiv.appendChild(btnDetalles);
    botonesDiv.appendChild(btnCarrito);
  
    return botonesDiv;
  }
  
  //funcion para ver los detalles de la pelicula
  function mostrarDetalles(pelicula) {
    var modal = document.getElementById('modal');
    modal.querySelector('#modal-img').src = pelicula.poster_path;
    modal.querySelector('#modal-title').textContent = pelicula.title;
    modal.querySelector('#modal-price').textContent = 'Precio: $' + pelicula.price;
    modal.querySelector('#modal-overview').textContent = pelicula.overview;
    modal.querySelector('#modal-add-to-cart').onclick = function() {
      anadirAlCarrito(pelicula);
      modal.style.display = 'none';
    };
    modal.style.display = 'flex';
    modal.querySelector('.close').onclick = function() {
      modal.style.display = 'none';
    };
  }
  
  //añadir pelicula al carrito
  function anadirAlCarrito(pelicula) {
    var carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    var existente = carrito.find(function(item) {
      return item.id === pelicula.id;
    });
    if (existente) {
      existente.cantidad++;
    } else {
      carrito.push(Object.assign({}, pelicula, { cantidad: 1 }));
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
  
  //cargar las peliculas 
  window.onload = cargarPeliculas;
  