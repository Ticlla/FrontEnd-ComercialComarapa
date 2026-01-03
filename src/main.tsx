import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// #region agent log
fetch('http://127.0.0.1:7242/ingest/36777587-812f-482a-85f8-893032ef0120',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:8',message:'main.tsx loaded',data:{rootElement:!!document.getElementById('root')},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(()=>{});
// #endregion

const rootElement = document.getElementById('root');

// #region agent log
fetch('http://127.0.0.1:7242/ingest/36777587-812f-482a-85f8-893032ef0120',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:14',message:'Before createRoot',data:{rootExists:!!rootElement},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(()=>{});
// #endregion

try {
  createRoot(rootElement!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/36777587-812f-482a-85f8-893032ef0120',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:24',message:'React render success',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(()=>{});
  // #endregion
} catch (error) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/36777587-812f-482a-85f8-893032ef0120',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:28',message:'React render FAILED',data:{error:String(error)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(()=>{});
  // #endregion
}
