import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

window.onerror = function (msg, url, line, col, error) {
  console.error('GLOBAL_ERROR:', msg, url, line, error);
  const errDiv = document.createElement('div');
  errDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:#ef4444;color:#fff;padding:24px;z-index:999999;font-family:sans-serif;font-size:16px;white-space:pre-wrap;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
  errDiv.innerHTML = `<h3>⚠️ Application Runtime Error</h3><p><strong>${msg}</strong></p><p>File: ${url}:${line}:${col}</p><pre>${error?.stack || ''}</pre>`;
  document.body.prepend(errDiv);
};

window.addEventListener('unhandledrejection', function (event) {
  console.error('UNHANDLED_REJECTION:', event.reason);
});

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('REACT_ERROR_BOUNDARY:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#1e1b4b', color: '#fff', fontFamily: 'sans-serif', minHeight: '100vh' }}>
          <h2 style={{ color: '#f87171', fontSize: '24px', marginBottom: '16px' }}>PLACAMATE - UI Error Detected</h2>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '8px', border: '1px solid #ef4444' }}>
            <p style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>{this.state.error?.message}</p>
            <pre style={{ color: '#94a3b8', fontSize: '13px', overflowX: 'auto' }}>{this.state.error?.stack}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
