import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';


import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyCDv5SgSyihVnIvACq_iC8qbjvI4g0q7JU",
  authDomain: "social-login-auth-6e9d4.firebaseapp.com",
  projectId: "social-login-auth-6e9d4",
  storageBucket: "social-login-auth-6e9d4.appspot.com",
  messagingSenderId: "803369796037",
  appId: "1:803369796037:web:12f5c74aa46833b643cbac"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
