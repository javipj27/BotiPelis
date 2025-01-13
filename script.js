// Función para obtener los datos de las películas desde el archivo JSON
function cargarPeliculas() {
  fetch('peliculas.json')
      .then(response => response.json())
      .then(data => {
          let peliculas = data.results;
          const container = document.getElementById('lista-peliculas');
          let peliculasMostradas = 0;
          const peliculasPorPagina = 8;

          // Función para mostrar las películas
          function mostrarPeliculas(peliculas, container, inicio, cantidad, limpiar = false) {
              if (limpiar) {
                  container.innerHTML = ''; // Limpiar el contenedor antes de mostrar las películas
              }
              const peliculasParaMostrar = peliculas.slice(inicio, inicio + cantidad);
              peliculasParaMostrar.forEach(pelicula => {
                  const peliculaDiv = document.createElement('div');
                  peliculaDiv.classList.add('pelicula');

                  // Crear elementos para cada película
                  const poster = document.createElement('img');
                  poster.src = pelicula.poster_path;
                  poster.alt = pelicula.title;

                  const titulo = document.createElement('h3');
                  titulo.textContent = pelicula.title;

                  // Crear elemento para el precio
                  const precio = document.createElement('p');
                  precio.textContent = `Precio: ${pelicula.price}€`;

                  // Crear contenedor para los botones
                  const botonesDiv = document.createElement('div');
                  botonesDiv.classList.add('botones');

                  const verDetallesBtn = document.createElement('button');
                  verDetallesBtn.textContent = 'Ver detalles';
                  verDetallesBtn.classList.add('ver-detalles');
                  verDetallesBtn.addEventListener('click', () => {
                      mostrarDetalles(pelicula);
                  });

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
                  peliculaDiv.appendChild(precio); // Añadir el precio debajo del título
                  peliculaDiv.appendChild(botonesDiv);

                  container.appendChild(peliculaDiv);
              });
          }

          // Función para mostrar detalles de la película en una ventana modal
          function mostrarDetalles(pelicula) {
              const modal = document.getElementById('modal');
              const modalImg = document.getElementById('modal-img');
              const modalTitle = document.getElementById('modal-title');
              const modalPrice = document.getElementById('modal-price');
              const modalOverview = document.getElementById('modal-overview');
              const modalAddToCartBtn = document.getElementById('modal-add-to-cart');

              modalImg.src = pelicula.poster_path;
              modalImg.alt = pelicula.title;
              modalTitle.textContent = pelicula.title;
              modalPrice.textContent = `Precio: $${pelicula.price}`;
              modalOverview.textContent = pelicula.overview;

              modalAddToCartBtn.onclick = () => {
                  anadirAlCarrito(pelicula);
                  modal.style.display = 'none';
              };

              modal.style.display = 'flex';

              const modalCloseBtn = document.querySelector('.modal .close');
              modalCloseBtn.onclick = () => {
                  modal.style.display = 'none';
              };
          }

          // Mostrar las primeras películas
          mostrarPeliculas(peliculas, container, peliculasMostradas, peliculasPorPagina, true);
          peliculasMostradas += peliculasPorPagina;

          // Función para cargar más películas al hacer scroll
          function cargarMasPeliculas() {
              if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                  mostrarPeliculas(peliculas, container, peliculasMostradas, peliculasPorPagina);
                  peliculasMostradas += peliculasPorPagina;
              }
          }

          // Agregar evento de scroll
          window.addEventListener('scroll', cargarMasPeliculas);

          
          // Ordenar películas por precio
          const ordenarSelect = document.getElementById('ordenar-precio');
          ordenarSelect.addEventListener('change', (event) => {
              const orden = event.target.value;
              if (orden === 'default') {
                  peliculas = data.results.slice().sort((a, b) => a.id - b.id); // Ordenar por id
              } else {
                  peliculas.sort((a, b) => {
                      if (orden === 'asc') {
                          return a.price - b.price;
                      } else {
                          return b.price - a.price;
                      }
                  });
              }
              peliculasMostradas = 0;
              mostrarPeliculas(peliculas, container, peliculasMostradas, peliculasPorPagina, true);
              peliculasMostradas += peliculasPorPagina;
          });

          // Filtrar películas por categoría
          const filtrarSelect = document.getElementById('filtrar-categoria');
          const aplicarFiltroBtn = document.getElementById('aplicar-filtro');
          aplicarFiltroBtn.addEventListener('click', () => {
              const categoria = filtrarSelect.value;
              let peliculasFiltradas;
              if (categoria === 'all') {
                  peliculasFiltradas = peliculas;
              } else {
                peliculasFiltradas = peliculas.filter(pelicula => pelicula.genre_names && pelicula.genre_names.includes(categoria));
              }
              peliculasMostradas = 0;
              mostrarPeliculas(peliculasFiltradas, container, peliculasMostradas, peliculasPorPagina, true);
              peliculasMostradas += peliculasPorPagina;
          });

          
      })
      .catch(error => console.error('Error al cargar las películas:', error));
}

// Función para añadir película al carrito
function anadirAlCarrito(pelicula) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  if (!Array.isArray(carrito)) {
    carrito = [];
  }
  const peliculaExistente = carrito.find(item => item.id === pelicula.id);

  if (peliculaExistente) {
    peliculaExistente.cantidad++;
  } else {
    pelicula.cantidad = 1;
    carrito.push(pelicula);
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Llamar a la función al cargar la página
window.onload = cargarPeliculas;
