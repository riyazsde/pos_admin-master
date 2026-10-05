// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import i18n from './i18n';
import store from './Store/store';
import App from './App';
import './index.css';

// Apply initial language (from localStorage)
const initialCode = store.getState().language.currentCode;
i18n.changeLanguage(initialCode);

// Keep i18n in sync with Redux
let lastCode = initialCode;

store.subscribe(() => {
  const code = store.getState().language?.currentCode;
  if (code && code !== lastCode) {
    lastCode = code;
    i18n.changeLanguage(code);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);