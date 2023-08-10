import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import {AuthContextProvider} from './context/AuthContext.jsx';
import { ChatContextProvider } from './context/ChatContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));root.render(
  
  <AuthContextProvider>
    <ChatContextProvider>
      <React.StrictMode>
        <App />
        <ToastContainer />
      </React.StrictMode>
    </ChatContextProvider>
  </AuthContextProvider>


)
