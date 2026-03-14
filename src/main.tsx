import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: Container element #root not found in the DOM.");
} else {
  // Global error handler for catching unhandled promise rejections and errors
  window.addEventListener('error', (event) => {
    console.error('Captured live error:', event.error);
    // Optional: display overlay if in development or specific debug mode
  });

  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    createRoot(rootElement).render(
      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'system-ui', textAlign: 'center', padding: '2rem', backgroundColor: '#fff1f2', color: '#991b1b'
      }}>
        <h1 style={{ marginBottom: '1rem' }}>⚠️ Missing Configuration</h1>
        <p style={{ maxWidth: '600px', lineHeight: 1.6 }}>
          The <b>VITE_FIREBASE_API_KEY</b> environment variable is missing.
          Vite requires these keys to be present <b>at build time</b>.
        </p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#b91c1c' }}>
          Please add your keys to Vercel and then <b>Redeploy</b> (ensure you CLEAR CACHE during redeploy).
        </p>
      </div>
    );
  } else {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  }
}
