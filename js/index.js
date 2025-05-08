async function loadJSON(file) {
    const response = await fetch(file);
    return await response.json();
}

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

    })
    .catch(error => {
        console.error('Error al cargar la lista de perfiles:', error);
    });

const urlParams = new URLSearchParams(window.location.search);
const lang = urlParams.get('lang') || 'es';
const configLangFile = `conf/config${lang.toUpperCase()}.json`;

loadJSON(configLangFile)
    .then(async (configuracion) => {
            try{
            const footer = document.getElementById('copyright');
            footer.textContent= configuracion.copyRight;
            const header = document.getElementById("header-title");
            console.log(footer);
            header.innerHTML = `${configuracion.sitio[0]} <small>${configuracion.sitio[1]}</small> ${configuracion.sitio[2]}`;
        }
            catch (error){
                console.error(`Error cargando`, error);
            }
        })
    