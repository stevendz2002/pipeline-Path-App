import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <section class="page-heading">
      <p class="eyebrow">Ruta /about</p>
      <h1>Sobre el proyecto</h1>
      <p>Aplicación construida con Angular, TypeScript, Path Location Strategy y consumo de una API pública.</p>
    </section>
    <div class="info-panel">
      <h2>Path Location Strategy</h2>
      <p>Las rutas no incluyen el símbolo <code>#</code> (URLs limpias). Se utiliza un fallback <code>404.html</code> (copia de <code>index.html</code>) para que las rutas directas y recargas funcionen correctamente en GitHub Pages.</p>
    </div>
  `,
})
export class AboutComponent {}
