// Función para cargar datos desde un archivo JSON
async function loadJSON(file) {
    const response = await fetch(file);
    return await response.json();
}

// Cargar la lista de perfiles
loadJSON('perfiles.json')
    .then(async (data) => {
        const profilePaths = data.perfiles;

        // Contenedor donde se insertarán los perfiles
        const container = document.getElementById('profiles-container');

        // Iteramos sobre cada ruta de perfil
        for (const path of profilePaths) {
            try {
                const perfilData = await loadJSON(path);

                // Extraemos la información del perfil
                const perfil = perfilData.perfil;

                // Creamos el elemento del perfil
                const gridItem = document.createElement('div');
                gridItem.classList.add('grid-item');

                // Imagen
                const img = document.createElement('img');
                img.src = `${perfil.imagen || 'default.jpg'}`;
                img.alt = perfil.nombre;
                img.style.width = '140px';
                img.style.height = 'auto';
                img.style.borderRadius = '4px';

                // Nombre
                const name = document.createElement('p');
                name.textContent = perfil.nombre;

                // Agregar elementos al DOM
                gridItem.appendChild(img);
                gridItem.appendChild(name);
                container.appendChild(gridItem);
            } catch (error) {
                console.error(`Error cargando ${path}:`, error);
            }
        }

        // Búsqueda opcional
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');

        if (searchInput && searchButton) {
            searchButton.addEventListener('click', () => {
                const term = searchInput.value.toLowerCase();
                const items = document.querySelectorAll('.grid-item');

                items.forEach(item => {
                    const name = item.querySelector('p').textContent.toLowerCase();
                    item.style.display = name.includes(term) ? 'block' : 'none';
                });
            });
        }

    })
    .catch(error => {
        console.error('Error al cargar la lista de perfiles:', error);
    });