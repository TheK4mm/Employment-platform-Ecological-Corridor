# Plataforma de Empleo - Corredor Ecológico

## Descripción

La **Plataforma de Empleo del Corredor Ecológico** es una aplicación web (en fase beta) diseñada para **apoyar a los habitantes del Corredor Ecológico en Villavicencio - Meta**, brindándoles un espacio donde puedan registrarse, consultar oportunidades laborales, postularse a ofertas y gestionar empleos de manera sencilla y segura.  

Este proyecto **académico**, surge como respuesta a la problemática de **desempleo en el sector**, ofreciendo una herramienta digital que conecta candidatos con empleadores.

---

## Tecnologías utilizadas

### Frontend
- **HTML5** y **CSS3**: para la estructura y estilo de la interfaz.  
- **JavaScript**: manejo de la interacción, envío de datos y consumo de API con `fetch()`.  
- **Diseño responsivo y minimalista**, con color verde característico del Corredor Ecológico.  

### Backend
- **Node.js** con **Express**: creación del servidor y gestión de rutas.  
- **JWT (jsonwebtoken)**: autenticación y control de sesiones mediante tokens.  
- **Middleware de autenticación** para proteger rutas sensibles.  

### Base de datos
- **MySQL (con conexión a través de mysql2)**: almacenamiento de usuarios, ofertas y postulaciones.  
- **Relaciones entre tablas**:  
  - `usuarios` (candidatos, empleadores y admin)  
  - `ofertas` (ofertas de empleo vinculadas a empleadores)  
  - `postulaciones` (candidatos aplicando a ofertas)  

---

## Funcionalidades

### Registro y Login
- Los usuarios pueden registrarse y/o iniciar sesión en un único formulario.  
- Las credenciales se guardan de forma segura en la base de datos con **hash de contraseñas**.  
- Autenticación mediante **JWT**, necesaria para acciones sensibles como postularse o crear ofertas.  

### Gestión de ofertas
- Los **empleadores** pueden crear, actualizar y eliminar ofertas de empleo.
- Los **candidatos** pueden visualizar todas las ofertas disponibles.
- Los **admin** poseen todos los permisos y accesos dentro de la plataforma.
- Los datos de las ofertas incluyen título, descripción, empresa y ubicación.  

### Gestión de postulaciones
- Los usuarios pueden postularse a una oferta.  
- Pueden eliminar o actualizar su postulación según sea necesario.  
- Las postulaciones están protegidas, solo el usuario dueño puede modificarlas.  

```bash
git clone https://github.com/TheK4mm/Employment-platform-Ecological-Corridor.git
