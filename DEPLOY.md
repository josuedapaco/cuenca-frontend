# Publicar Cuenca en tu servidor

## 1. Crear los servicios en EasyPanel

Proyecto sugerido: cuenca. Servicios: backend y frontend.

Ambos repositorios son privados: conecta GitHub con acceso a los dos. Rama main, Build Path / y Dockerfile Dockerfile. No pegues solo el Dockerfile en un servicio vacío: el build necesita todos los archivos del repositorio.

### Backend

Repositorio: josuedapaco/cuenca-backend

- Puerto interno: **8000**
- Variable DATABASE_PATH=/app/data/cuenca.sqlite
- Variable PUBLIC_ORIGINS=https://cuencany.com,https://www.cuencany.com
- Variable ADMIN_API_KEY: genera una clave secreta y guárdala solo en EasyPanel.
- Monta un **volumen persistente en /app/data**.
- Despliega y revisa que Uvicorn termine el arranque sin errores.
- No necesita dominio público propio: el frontend lo alcanza por la red interna.

Para generar la clave administrativa localmente:

~~~sh
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
~~~

### Frontend

Repositorio: josuedapaco/cuenca-frontend

- Puerto interno: **8080**
- Variable BACKEND_HOST=cuenca_backend **si EasyPanel muestra ese nombre interno para tu servicio**.
- Variable BACKEND_PORT=8000.
- Usa el DNS interno real de EasyPanel si es diferente. No pongas https://, un puerto ni una barra en BACKEND_HOST.
- Despliega después del backend.

## 2. Apuntar el dominio

En la zona DNS del proveedor de cuencany.com:

| Tipo | Nombre | Valor |
| --- | --- | --- |
| A | @ | IP pública de tu servidor |
| CNAME | www | cuencany.com |

Revisa registros A/AAAA anteriores para que no apunten a otro servidor.

En **Domains** del frontend añade:

- Host cuencany.com, HTTPS activado, destino HTTP al puerto **8080**.
- Host www.cuencany.com, HTTPS activado, destino HTTP al puerto **8080**.

Escribe únicamente el host en el campo de dominio: no https://cuencany.com/. EasyPanel gestiona el certificado y recibe tráfico público en 80/443.

## 3. Validar

~~~sh
curl https://cuencany.com/healthz
curl https://cuencany.com/api/health
curl https://cuencany.com/api/menu
~~~

Comprueba llamadas, enlaces a mapas, selector ES/EN y una consulta de prueba. Una consulta guardada muestra referencia y requiere confirmación telefónica.

## 4. Consultar solicitudes de catering

La API permite ver hasta las 500 consultas más recientes con una clave administrativa. No pongas esa clave en el frontend ni en GitHub. Con ADMIN_API_KEY configurada en tu terminal:

~~~sh
curl -H "Authorization: Bearer $ADMIN_API_KEY" https://cuencany.com/api/admin/catering
~~~

El formulario guarda nombre, teléfono, correo opcional, fecha, invitados y platos. No envía correos ni mensajes externos automáticamente.

## 5. Datos pendientes del negocio

Confirma el horario general, vigencia de precios/promociones, condiciones de entrega y precios faltantes antes de anunciarlos como vigentes. El sitio usa “Consultar” para precios no facilitados y recomienda llamar para conocer los horarios.

El nombre de la foto de mariscos no fue confirmado: se muestra como foto general de mariscos, sin atribuirle un número de plato.

## 6. Persistencia y copias

Conserva el volumen /app/data entre despliegues. Haz copias coherentes de SQLite con su API de backup o con el servicio detenido; no borres el volumen. La imagen corre como usuario UID 1000; si usas un montaje de carpeta, asegúrate de que tenga permisos para ese usuario.

No se ha desplegado ni modificado DNS desde este proyecto: esta guía y los Dockerfiles permiten hacerlo en tu servidor.
