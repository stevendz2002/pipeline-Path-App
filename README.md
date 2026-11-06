# Pipeline-Path-App Pokédex

Aplicación Angular con navegación mediante `PathLocationStrategy` (HTML5 pushState) y una vista de Pokédex alimentada por [PokéAPI](https://pokeapi.co/).

## Desarrollo

```bash
npm ci
npm start
```

La aplicación tiene estas rutas estándar:

- `/` - Inicio
- `/pokemon` - Lista de Pokémon
- `/about` - Información del proyecto

## Validación

```bash
npm test
npm run build
```

## GitHub Pages y PathLocationStrategy

Al usar `PathLocationStrategy`, el servidor de GitHub Pages necesita redirigir las solicitudes que no coincidan directamente con archivos hacia `index.html`. Por ello, en el workflow de despliegue se genera una copia de respaldo SPA:

```bash
cp ./dist/Pipeline-Path-App/browser/index.html ./dist/Pipeline-Path-App/browser/404.html
```
