async function loadJSON(file) {
    const response = await fetch(file);
    return await response.json();
}

const urlParams = new URLSearchParams(window.location.search);
const lang = urlParams.get('lang') || 'es';
const configLangFile = `conf/config${lang.toUpperCase()}.json`;

loadJSON('datos/index.json')
    .then(async (data) => {
        const profilePaths = data.perfiles;

        const container = document.getElementById('profiles-container');

        for (const perfil of profilePaths) {
            try {

                const gridItem = document.createElement('div');
                gridItem.classList.add('grid-item');

                const img = document.createElement('img');
                img.src = `${perfil.imagen}`;
                img.alt = perfil.nombre;
                img.style.width = 'auto';
                img.style.height = '170px';
                img.style.borderRadius = '4px';

                const name = document.createElement('p');
                name.textContent = perfil.nombre;

                gridItem.appendChild(img);
                gridItem.appendChild(name);
                container.appendChild(gridItem);

                gridItem.addEventListener('click', () => {
                    window.location.href = `perfil.html?path=${encodeURIComponent(perfil.ci)}`;
                });

            } catch (error) {
                console.error(`Error cargando ${path}:`, error);
            }
        }

        const originalProfiles = [...container.children];
        const searchForm = document.getElementById('barra');
        const searchInput = document.getElementById('buscador');
        searchForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            const query = searchInput.value.trim();
            container.innerHTML = '';
            let found = false;
            for (const perfil of profilePaths) {
                if (perfil.nombre.includes(query)) {
                    found = true;
                    const gridItem = document.createElement('div');
                    gridItem.classList.add('grid-item');
                    const img = document.createElement('img');
                    img.src = `${perfil.imagen}`;
                    img.alt = perfil.nombre;
                    img.style.width = 'auto';
                    img.style.height = '170px';
                    img.style.borderRadius = '4px';
                    const name = document.createElement('p');
                    name.textContent = perfil.nombre;
                    gridItem.appendChild(img);
                    gridItem.appendChild(name);
                    container.appendChild(gridItem);
                    gridItem.addEventListener('click', () => {
                        window.location.href = `perfil.html?path=${encodeURIComponent(perfil.ci)}`;
                    });
                }
            }

            if (!found) {
            loadJSON(configLangFile)
            .then(async (configuracion) => {
                    container.innerHTML = '';
                    container.style.display = 'flex';
                    container.style.justifyContent = 'center';
                    container.style.alignItems = 'center';
                    container.style.height = '50vh'; 
                    container.style.flexDirection = 'column';
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('no-results');
                    texto_2= configuracion.Error + " " + query;
                    messageDiv.textContent =texto_2 ;

                    container.appendChild(messageDiv);
            })
        }
    
        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim() === '') {
                container.innerHTML = '';
                container.style.display = 'grid';
                container.style.gridTemplateColumns = 'repeat(5, 1fr)';
                container.style.gap = '20px';
                container.style.padding = '20px';
        
                originalProfiles.forEach(profile => container.appendChild(profile.cloneNode(true)));
            }
        });
    });

        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim() === '') {
                container.innerHTML = '';
                originalProfiles.forEach(profile => container.appendChild(profile.cloneNode(true)));
            }
        });
    })
    .catch(error => {
        console.error('Error al cargar la lista de perfiles:', error);
    });



loadJSON(configLangFile)
    .then(async (configuracion) => {
            try{
            const footer = document.getElementById('copyright');
            footer.textContent= configuracion.copyRight;
            const header = document.getElementById("header-title");
            header.innerHTML = `${configuracion.sitio[0]} <small>${configuracion.sitio[1]}</small> ${configuracion.sitio[2]}`;
            const nombre = document.getElementById("saludo");
            const texto= configuracion.saludo + ", Diego Molina";
            nombre.textContent= texto;
        }
            catch (error){
                console.error(`Error cargando`, error);
            }
        })
    