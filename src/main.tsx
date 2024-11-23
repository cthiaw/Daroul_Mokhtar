import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeDatabase } from './db/firebase';

async function startApp() {
  try {
    await initializeDatabase();
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Error initializing database:', error);
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = '<div class="p-4"><h1 class="text-xl font-bold text-red-600">Error initializing application</h1><p class="mt-2">Please refresh the page or contact support if the problem persists.</p></div>';
    }
  }
}

startApp();