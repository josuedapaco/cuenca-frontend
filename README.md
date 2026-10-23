# Cuenca Coffee Shop — frontend

Vue 3 + Vite + Three.js. Dominio previsto: **https://cuencany.com**.

Web bilingüe español/inglés con carta completa (191 opciones, incluidos los 141 platos numerados), búsqueda que ignora acentos, categorías, fotos del dossier en WebP, modelo 3D original inspirado en las cúpulas de Cuenca, llamadas, indicaciones en Google/Apple Maps y formulario de consultas para eventos.

## Desarrollo

Requiere Node 22.12+ o 24.

~~~sh
npm ci
npm run dev
~~~

Inicia el backend en http://127.0.0.1:8010. Vite redirige /api a ese puerto. npm test comprueba catálogo, búsqueda, idioma, filtro y consultas; npm run build genera dist.

## Producción con Docker

Dockerfile en la raíz del repositorio. Nginx escucha **84**.

- BACKEND_HOST: nombre DNS interno del servicio FastAPI, por ejemplo cuenca_backend en EasyPanel.
- BACKEND_PORT: 84.
- El navegador usa /api en el mismo dominio; no requiere recompilar una URL de API.
- GET /healthz comprueba Nginx. GET /api/health comprueba FastAPI.
- El menú de public/menu.json permite consultar la carta si la API está temporalmente fuera de servicio. Las consultas de eventos necesitan el backend: nunca se simula un envío correcto.

## Inicio local de ambos contenedores

Clona el backend en ../backend respecto de esta carpeta:

~~~sh
docker compose up --build -d
~~~

Abre http://localhost:84. No ejecutes docker compose down -v si deseas conservar las consultas.

La guía [DEPLOY.md](DEPLOY.md) detalla EasyPanel, DNS y HTTPS.

## Contenido y mantenimiento

Las fotos, nombres, traducciones y precios provienen del dossier suministrado por el propietario. Consulta [ASSET_SOURCES.md](ASSET_SOURCES.md). No se inventaron horarios, precios ilegibles, reseñas, tiempos al aeropuerto ni condiciones de entrega.

El menú principal vive en app/menu.json del backend; sincroniza también public/menu.json aquí cuando cambie. Algunas fotografías del dossier son mejoras generativas: se indica en la galería. El modelo 3D es ilustrativo y no representa la fachada del local.

La animación respeta prefers-reduced-motion, se detiene fuera de pantalla y dispone de una imagen alternativa si WebGL no funciona. La carga de Three.js está separada del código principal.

No incluye procesamiento de pagos, pedidos pagados ni confirmaciones automáticas de catering. No se configuró correo automático porque no se facilitó una dirección receptora.
