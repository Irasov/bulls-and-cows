import { startApp } from './app.js';
import { el } from './dom.js';
const root = el('main');
document.body.append(root);
startApp(root);
