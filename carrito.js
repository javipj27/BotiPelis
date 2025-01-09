document.addEventListener('DOMContentLoaded', () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const container = document.getElementById('carrito');

    if (carrito.length === 0) {
        container.innerHTML = '<p>El carrito está vacío</p>';
    } else {
        carrito.forEach(pelicula => {
            const peliculaDiv = document.createElement('div');
            peliculaDiv.classList.add('pelicula');

            const poster = document.createElement('img');
            poster.src = pelicula.poster_path;
            poster.alt = pelicula.title;

            const titulo = document.createElement('h3');
            titulo.textContent = pelicula.title;

            const precio = document.createElement('p');
            precio.textContent = `Precio: $${pelicula.price * pelicula.cantidad}`;

            const cantidad = document.createElement('p');
            cantidad.textContent = `Cantidad: ${pelicula.cantidad}`;

            const incrementarBtn = document.createElement('button');
            incrementarBtn.textContent = '+';
            incrementarBtn.classList.add('incrementar');
            incrementarBtn.addEventListener('click', () => {
                pelicula.cantidad++;
                actualizarCarrito();
            });

            const decrementarBtn = document.createElement('button');
            decrementarBtn.textContent = '-';
            decrementarBtn.classList.add('decrementar');
            decrementarBtn.addEventListener('click', () => {
                if (pelicula.cantidad > 1) {
                    pelicula.cantidad--;
                    actualizarCarrito();
                }
            });

            const eliminarBtn = document.createElement('button');
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.classList.add('eliminar');
            eliminarBtn.addEventListener('click', () => {
                eliminarDelCarrito(pelicula.id);
            });

            peliculaDiv.appendChild(poster);
            peliculaDiv.appendChild(titulo);
            peliculaDiv.appendChild(precio);
            peliculaDiv.appendChild(cantidad);
            peliculaDiv.appendChild(incrementarBtn);
            peliculaDiv.appendChild(decrementarBtn);
            peliculaDiv.appendChild(eliminarBtn);
            container.appendChild(peliculaDiv);
        });
    }
});

function actualizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    location.reload();
}

function eliminarDelCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(pelicula => pelicula.id !== id);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    location.reload();
}