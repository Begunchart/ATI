import os
import json
from wsgiref.simple_server import make_server
from urllib.parse import parse_qs
from mimetypes import guess_type

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

def load_json(filepath):
    abs_filepath = os.path.join(BASE_DIR, filepath)
    if not os.path.exists(abs_filepath):
        print(f"Advertencia: Archivo JSON no encontrado: {abs_filepath}")
        return None
    try:
        with open(abs_filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error decodificando JSON en {abs_filepath}: {e}")
        return None
    except Exception as e:
        print(f"Error al leer archivo {abs_filepath}: {e}")
        return None

def generate_profile_html(perfil_data, config_data):
    perfil = perfil_data.get('perfil', {})

    profile_image_src = perfil.get('imagen', 'placeholder.jpg') 

    html_content = f"""
    <div id="container_1">
        <img src="{profile_image_src}" alt="Imagen de perfil" class="profile-image-1">
        <div class="container_2">
            <button class="back-button" onclick="showProfilesList()">&#8592; Volver</button>
            <h1>{perfil.get('nombre', 'N/A')}</h1>
            <p class="description">{perfil.get('descripcion', 'N/A')}</p>
            <ul>
                <li>{config_data.get('color', 'Mi color favorito es')}: {perfil.get('color', 'N/A')}</li>
                <li>{config_data.get('libro', 'Mi libro favorito es')}: {perfil.get('libro', ['N/A'])[0]}</li>
                <li>{config_data.get('musica', 'Mi estilo de música preferida')}: {perfil.get('musica', ['N/A'])[0]}</li>
                <li>{config_data.get('video_juego', 'Vídeo juegos favoritos')}: {perfil.get('video_juego', ['N/A'])[0]}</li>
                <li>{config_data.get('lenguajes', 'Lenguajes aprendidos')}: {', '.join(perfil.get('lenguajes', ['N/A']))}</li>
                <li>
                    {config_data.get('email', 'Si necesitan comunicarse conmigo me pueden escribir a [email]').replace('[email]', perfil.get('email', 'N/A'))}
                    <a href="mailto:{perfil.get('email', '')}" class="email-link">{perfil.get('email', 'N/A')}</a>
                </li>
            </ul>
        </div>
    </div>
    """
    return html_content

def application(environ, start_response):
    path = environ.get('PATH_INFO', '').lstrip('/')
    query_string = environ.get('QUERY_STRING', '')
    query_params = parse_qs(query_string) 
    if path == 'get_profile_html':
        cedula = query_params.get('path', [None])[0]
        lang = query_params.get('lang', ['es'])[0]

        if not cedula:
            start_response('400 Bad Request', [('Content-Type', 'text/plain')])
            return [b'No se proporciono C.I.']

        profile_filepath = os.path.join(cedula, 'perfil.json')
        config_filepath = f'conf/config{lang.upper()}.json'

        perfil_data = load_json(profile_filepath)
        config_data = load_json(config_filepath)

        if not perfil_data or not config_data:
            start_response('500 Internal Server Error', [('Content-Type', 'text/plain')])
            return [b'Error al cargar datos del perfil o configuracion.']
        
        profile_html = generate_profile_html(perfil_data, config_data)
        start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
        return [profile_html.encode('utf-8')]
    if not path:
        path = 'index.html' 

    filepath = os.path.join(BASE_DIR, path)

    if not os.path.exists(filepath) or not os.path.isfile(filepath):
        start_response('404 Not Found', [('Content-Type', 'text/plain')])
        return [b'Not Found']

    content_type, _ = guess_type(filepath)
    if content_type is None:
        content_type = 'application/octet-stream'

    try:
        f = open(filepath, 'rb')
        start_response('200 OK', [('Content-Type', content_type)])
        content = f.read()
        f.close() 
        return [content]

    except IOError:
        start_response('500 Internal Server Error', [('Content-Type', 'text/plain')])
        return [b'Internal Server Error']

if __name__ == '__main__':
    httpd = make_server('0.0.0.0', 80, application)
    print("Serving on port 80...")
    httpd.serve_forever()