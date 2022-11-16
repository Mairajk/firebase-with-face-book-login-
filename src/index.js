import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';


import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCy-bCTcJUh788D520gHwvGfSAptX70Oqs",
  authDomain: "login-with-face-book.firebaseapp.com",
  projectId: "login-with-face-book",
  storageBucket: "login-with-face-book.appspot.com",
  messagingSenderId: "1048714268782",
  appId: "1:1048714268782:web:ea282f5f173c8eb0a8167f"
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
