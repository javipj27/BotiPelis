// Función para obtener los datos de las películas desde el archivo JSON
function cargarPeliculas() {
  fetch('peliculas.json')
      .then(response => response.json())
      .then(data => {
          const peliculas = data.results;
          const container = document.getElementById('lista-peliculas');

          // Mostrar las primeras 8 películas
          mostrarPeliculas(peliculas.slice(0, 8), container);

          let pagina = 1;
          const peliculasPorPagina = 8;

          // Función para mostrar las películas
          function mostrarPeliculas(peliculas, container) {
              peliculas.forEach(pelicula => {
                  const peliculaDiv = document.createElement('div');
                  peliculaDiv.classList.add('pelicula');

                  // Crear elementos para cada película
                  const poster = document.createElement('img');
                  poster.src = pelicula.poster_path;
                  poster.alt = pelicula.title;

                  const titulo = document.createElement('h3');
                  titulo.textContent = pelicula.title;

                  // Crear contenedor para los botones
                  const botonesDiv = document.createElement('div');
                  botonesDiv.classList.add('botones');

                  const verDetallesBtn = document.createElement('button');
                  verDetallesBtn.textContent = 'Ver detalles';
                  verDetallesBtn.classList.add('ver-detalles');

                  const anadirCarritoBtn = document.createElement('button');
                  anadirCarritoBtn.textContent = 'Añadir al carrito';
                  anadirCarritoBtn.classList.add('anadir-carrito');
                  anadirCarritoBtn.addEventListener('click', () => {
                    anadirAlCarrito(pelicula);
                  });

                  // Agregar botones al contenedor de botones
                  botonesDiv.appendChild(verDetallesBtn);
                  botonesDiv.appendChild(anadirCarritoBtn);

                  // Añadir elementos al div de la película
                  peliculaDiv.appendChild(poster);
                  peliculaDiv.appendChild(titulo);
                  peliculaDiv.appendChild(botonesDiv);

                  container.appendChild(peliculaDiv);
              });
          }

          // Función para cargar más películas con scroll infinito
          window.onscroll = function () {
              if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                  if ((pagina * peliculasPorPagina) < peliculas.length) {
                      pagina++;
                      const nextPeliculas = peliculas.slice(pagina * peliculasPorPagina - peliculasPorPagina, pagina * peliculasPorPagina);
                      mostrarPeliculas(nextPeliculas, container);
                      mostrarPreload();
                  }
              }
          };

          // Mostrar mensaje de carga
          function mostrarPreload() {
              const preload = document.createElement('div');
              preload.classList.add('preload');
              preload.textContent = 'Cargando más películas...';
              document.body.appendChild(preload);

              setTimeout(() => {
                  preload.remove();
              }, 2000);
          }
          
      })
      .catch(error => console.error('Error al cargar las películas:', error));
}

// Función para añadir película al carrito
function anadirAlCarrito(pelicula) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.push(pelicula);
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Llamar a la función al cargar la página
window.onload = cargarPeliculas;
