import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './style.scss';
import 'react-phone-input-2/lib/style.css';
import { AuthContext } from './context/AuthContext.jsx';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import AddPostPage from './pages/AddPostPage/AddPostPage.jsx';
import CategoriesPage from './pages/CategoriesPage/CategoriesPage.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import WalletPage from './pages/WalletPage/WalletPage.jsx';
import MarklistPage from './pages/MarklistPage/MarklistPage.jsx';
import SettingsPage from './pages/SettingsPage/SettingsPage.jsx';
import TransitionPage from './pages/TransitionPage/TransitionPage.jsx';
import ChatInterface from './pages/ChatInterface/ChatInterface.jsx';


const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route path='home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="chat" element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="addpost" element={<ProtectedRoute><AddPostPage /></ProtectedRoute>} />
          <Route path="categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
          <Route path="marklist" element={<ProtectedRoute><MarklistPage /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="transition" element={<ProtectedRoute><TransitionPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
