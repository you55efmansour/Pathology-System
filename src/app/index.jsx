import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@/features/shared/i18n';
import '@/features/shared/theme/appPalette';
import '@/styles/index.css';

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
