async function loadJSON(file) {
    const response = await fetch(file);
    return await response.json();
}
const urlParams = new URLSearchParams(window.location.search);
const lang = urlParams.get('lang').toLocaleUpperCase() || 'ES';
loadJSON('perfiles.json')
    .then(async (data) => {
        const profilePaths = data.perfiles;

        const container = document.getElementById('profiles-container');

        for (const path of profilePaths) {
            try {
                const perfilData = await loadJSON(path);

                const perfil = perfilData.perfil;

                const gridItem = document.createElement('div');
                gridItem.classList.add('grid-item');

                const img = document.createElement('img');
                img.src = `${perfil.imagen || 'default.jpg'}`;
                img.alt = perfil.nombre;
                img.style.width = '140px';
                img.style.height = 'auto';
                img.style.borderRadius = '4px';

                const name = document.createElement('p');
                name.textContent = perfil.nombre;

                gridItem.appendChild(img);
                gridItem.appendChild(name);
                container.appendChild(gridItem);

                gridItem.addEventListener('click', () => {
                    window.location.href = `perfil.html?path=${encodeURIComponent(path)}`;
                });

            } catch (error) {
                console.error(`Error cargando ${path}:`, error);
            }
        }

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