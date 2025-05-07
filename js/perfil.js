async function loadJSON(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`Error al cargar ${file}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

const urlParams = new URLSearchParams(window.location.search);
const path = urlParams.get('path');
const lang = urlParams.get('lang').toLocaleUpperCase() || 'ES';

const configLangFile = `conf/config${lang.toUpperCase()}.json`;

Promise.all([
    loadJSON(path),
    loadJSON(configLangFile)
]).then(([perfilData, configData]) => {
    if (!perfilData || !configData) {
        console.error("Datos no cargados correctamente.");
        return;
    }

    const perfil = perfilData.perfil;
    const config = configData.config;

    const container = document.getElementById("container_1");

    const profileContainer = document.createElement("div");
    profileContainer.classList.add("profile-container");

    const profileImage = document.createElement("img");
    profileImage.src = perfil.imagen; 
    profileImage.alt = "Imagen de perfil";
    profileImage.classList.add("profile-image-1");
    profileContainer.appendChild(profileImage);

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("container_2");

    const nameHeading = document.createElement("h1");
    nameHeading.textContent = perfil.nombre;
    infoContainer.appendChild(nameHeading);

    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.classList.add("description");
    descriptionParagraph.textContent = perfil.descripcion;
    infoContainer.appendChild(descriptionParagraph);

    const infoList = document.createElement("ul");

    const colorItem = document.createElement("li");
    colorItem.textContent = `${config.color}: ${perfil.color}`;
    infoList.appendChild(colorItem);

    const bookItem = document.createElement("li");
    bookItem.textContent = `${config.libro}: ${perfil.libro[0]}`;
    infoList.appendChild(bookItem);

    const musicItem = document.createElement("li");
    musicItem.textContent = `${config.musica}: ${perfil.musica[0]}`;
    infoList.appendChild(musicItem);

    const gameItem = document.createElement("li");
    gameItem.textContent = `${config.video_juego}: ${perfil.video_juego[0]}`;
    infoList.appendChild(gameItem);

    const languagesItem = document.createElement("li");
    languagesItem.textContent = `${config.lenguajes}: ${perfil.lenguajes.join(", ")}`;
    infoList.appendChild(languagesItem);

    const emailItem = document.createElement("li");
    const emailLink = document.createElement("a");
    emailLink.href = `mailto:${perfil.email}`;
    emailLink.textContent = perfil.email;
    emailLink.classList.add("email-link");
    emailItem.textContent = `${config.email.replace("[email]", perfil.email)}`;
    emailItem.appendChild(emailLink);
    infoList.appendChild(emailItem);

    infoContainer.appendChild(infoList);

    profileContainer.appendChild(infoContainer);
    container.appendChild(profileContainer);
}).catch((error) => {
    console.error("Error al cargar los datos:", error);
});