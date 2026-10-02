// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './i18n/index'; 
import store from './Store/store';
import App from './App';
import './index.css';

let lastCode = store.getState().language.currentCode;
store.subscribe(() => {
  const code = store.getState().language.currentCode;
  if (code !== lastCode) {
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