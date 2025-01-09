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

            peliculaDiv.appendChild(poster);
            peliculaDiv.appendChild(titulo);
            container.appendChild(peliculaDiv);
        });
    }
});