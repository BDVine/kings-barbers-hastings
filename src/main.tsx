import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './v2/v2.css';
import AppB from './v2/AppB';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppB />
  </StrictMode>
);
