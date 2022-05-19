import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ToggleColorMode from './utils/ToggleColorMode';
import reportWebVitals from './reportWebVitals';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ToggleColorMode />
  </React.StrictMode>
);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnjnsVovQ3Vyt_G__wWJwb533oU3sHISs",
  authDomain: "pixle-it.firebaseapp.com",
  projectId: "pixle-it",
  storageBucket: "pixle-it.appspot.com",
  messagingSenderId: "1087921062282",
  appId: "1:1087921062282:web:874024540c4ff5833e8873",
  measurementId: "G-876S5H55TR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);

analytics.app.automaticDataCollectionEnabled = true
