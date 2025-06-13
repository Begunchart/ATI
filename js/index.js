async function loadJSON(file) {
    const response = await fetch(file);
    if (!response.ok) {
        throw new Error(`Error al cargar ${file}: ${response.statusText}`);
    }
    return await response.json();
}

const urlParams = new URLSearchParams(window.location.search);
const lang = urlParams.get('lang') || 'es';
const configLangFile = `conf/config${lang.toUpperCase()}.json`;

let allProfilesData = []; 
const profilesContainer = document.getElementById('profiles-container');
const profileDetailContainer = document.getElementById('profile-detail');
const mainContent = document.getElementById('main-content'); 
function showProfilesList() {
    profilesContainer.style.display = 'grid'; 
    profileDetailContainer.innerHTML = ''; 
    profileDetailContainer.style.display = 'none';
    profilesContainer.style.gridTemplateColumns = 'repeat(5, 1fr)'; 
    profilesContainer.style.gap = '20px';
    profilesContainer.style.padding = '20px';
}


function showProfileDetail(htmlContent) {
    profilesContainer.style.display = 'none';
    profileDetailContainer.innerHTML = htmlContent;
    profileDetailContainer.style.display = 'block'; 
}

loadJSON('datos/index.json')
    .then(async (data) => {
        allProfilesData = data.perfiles; 
        renderProfiles(allProfilesData);

        const originalProfiles = [...profilesContainer.children]; 

        const searchForm = document.getElementById('barra');
        const searchInput = document.getElementById('buscador');
        
        searchForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const query = searchInput.value.trim().toLowerCase(); 
            profilesContainer.innerHTML = ''; 
            
            const filteredProfiles = allProfilesData.filter(perfil => 
                perfil.nombre.toLowerCase().includes(query)
            );

            if (filteredProfiles.length > 0) {
                renderProfiles(filteredProfiles);
                showProfilesList(); 
            } else {
                loadJSON(configLangFile)
                    .then((configuracion) => {
                        profilesContainer.innerHTML = '';
                        profilesContainer.style.display = 'flex';
                        profilesContainer.style.justifyContent = 'center';
                        profilesContainer.style.alignItems = 'center';
                        profilesContainer.style.height = '50vh';
                        profilesContainer.style.flexDirection = 'column';
                        const messageDiv = document.createElement('div');
                        messageDiv.classList.add('no-results');
                        const texto_2 = configuracion.Error + " " + query;
                        messageDiv.textContent = texto_2;
                        profilesContainer.appendChild(messageDiv);
                    })
                    .catch(error => console.error('Error al cargar config para mensaje de error:', error));
            }
        });
        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim() === '') {
                renderProfiles(allProfilesData); 
                showProfilesList(); 
            }
        });
    })
    .catch(error => {
        console.error('Error al cargar la lista de perfiles:', error);
    });

function renderProfiles(profilesToRender) {
    profilesContainer.innerHTML = ''; 
    profilesContainer.style.display = 'grid'; 
    profilesContainer.style.gridTemplateColumns = 'repeat(5, 1fr)'; 
    profilesContainer.style.gap = '20px';
    profilesContainer.style.padding = '20px';

    for (const perfil of profilesToRender) {
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
        profilesContainer.appendChild(gridItem);

        gridItem.addEventListener('click', async () => {
            try {
                
                const response = await fetch(`/get_profile_html?path=${encodeURIComponent(perfil.ci)}&lang=${lang}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const profileHtml = await response.text();
                showProfileDetail(profileHtml);
            } catch (error) {
                console.error('Error al cargar el detalle del perfil:', error);   
                alert('Hubo un error al cargar el perfil.');
            }
        });
    }
}

loadJSON(configLangFile)
    .then(async (configuracion) => {
        try {
            const footer = document.getElementById('copyright');
            footer.textContent = configuracion.copyRight;
            const header = document.getElementById("header-title");
            header.innerHTML = `${configuracion.sitio[0]} <small>${configuracion.sitio[1]}</small> ${configuracion.sitio[2]}`;
            const nombre = document.getElementById("saludo");
            const texto = configuracion.saludo + ", Diego Molina";
            nombre.textContent = texto;
        } catch (error) {
            console.error(`Error cargando configuración de idioma:`, error);
        }
    })
    .catch(error => {
        console.error('Error al cargar archivo de configuración de idioma:', error);
    });

document.addEventListener('DOMContentLoaded', showProfilesList);