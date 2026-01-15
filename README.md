# Social Media Platform – Frontend

Aplicación web desarrollada con React que permite a los usuarios interactuar en una red social, compartir contenido multimedia y comunicarse en tiempo real mediante chat.

El frontend consume una API REST y gestiona la autenticación mediante cookies httpOnly.

## 🚀 Demo en Producción

- Frontend: https://prueba-login-y-register.web.app/login
- Backend API: https://apisocialmedia-oesl.onrender.com

## 🚧 Estado del Proyecto

Este proyecto se encuentra en desarrollo activo.

Actualmente incluye:
- Visualización de fotos y videos
- Chat en tiempo real
- Autenticación segura mediante cookies httpOnly

Próximas mejoras planeadas:
- Visualización de perfiles de usuario
- Edición de perfil
- Recuperación de contraseña

## 🛠️ Tecnologías

- React
- JavaScript
- React Router
- CSS
- Fetch

## 📁 Estructura del Proyecto

-src/
- ├── assets/        # Imágenes y recursos estáticos.
- ├── components/    # Componentes reutilizables.
- ├── fonts/         # Fuentes personalizadas.
- ├── styles/        # Estilos globales y ajustes responsivos.
- ├── App.jsx        # Componente raíz.
- ├── main.jsx       # Punto de entrada.

## 🔐 Autenticación

- La autenticación se realiza mediante cookies httpOnly.
- El frontend no almacena ni accede directamente al token JWT.
- Las peticiones autenticadas se envían usando `credentials: 'include'`.
- 

## 🧭 Control de Acceso

- Las validaciones críticas se realizan siempre desde el backend.
- Las rutas sensibles están protegidas.
> Este proyecto no implementa roles de usuario ya que está diseñado como una plataforma cerrada para uso privado.

## ✨ Funcionalidades

- Registro e inicio de sesión de usuarios
- Subida de imágenes y videos
- Chat en tiempo real
- Consumo de API REST

## 🔄 Comunicación con la API

- El frontend consume una API REST desarrollada en Node.js.
- La API es responsable de la validación, seguridad y persistencia de datos.

## 🚀 Instalación

1. Clonar el repositorio
2. Instalar dependencias
   ```bash
   npm install


## 📚 Aprendizajes

- Manejo de autenticación con cookies httpOnly
- Organización de proyectos React
- Comunicación segura con backend

## ℹ️ Nota de Diseño

Este proyecto fue desarrollado como una aplicación cerrada para un grupo reducido de usuarios.
Por este motivo, no se implementó un sistema de roles.

La validación de permisos y roles esta siendo aplicada en un proyecto para viajes.

## 🔗 Backend

Repositorio del backend: https://github.com/tu-usuario/tu-backend](https://github.com/aaronr24468/ApiSocialMedia
