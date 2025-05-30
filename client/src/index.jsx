import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';

import App from 'App';

console.log('Client entry point executing'); // Debug log

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement); // Debug log

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
