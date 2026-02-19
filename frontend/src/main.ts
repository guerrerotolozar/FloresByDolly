// ⚠️ OBLIGATORIO: importar zone.js ANTES de Angular para que Zone.js
// parche las APIs async (setTimeout, Promise, XHR, etc.) y Angular
// detecte automáticamente los cambios cuando llegan respuestas HTTP.
// Sin esto, la vista no se actualiza al hacer this.data = response en subscribe().
import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
