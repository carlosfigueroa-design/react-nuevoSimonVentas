import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';

// Seguros Bolívar Design System
import '@seguros-bolivar/ui-bundle/dist/sb-ui-seguros-bolivar-light.min.css';
import '@seguros-bolivar/ui-bundle/dist/sb-ui-components.min.js';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
