import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <div>
      React hooks & TypeScript
    </div>
  )
}
ReactDOM.render(<App />, document.querySelector('#root'))
if ('serviceWorker' in navigator && process.env.MODE === 'prod') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      registration => {
        console.log('SW registered:', registration)
      }
    ).catch(
      registrationError => {
        console.log('SW registered failed:', registrationError)
      }
    )
  })
}