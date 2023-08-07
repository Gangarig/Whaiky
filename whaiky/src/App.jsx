import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './style.scss';
import 'react-phone-input-2/lib/style.css';
import { AuthContext } from './context/AuthContext.jsx';
import ChatInterface from './pages/ChatInterface';
import AddPostPage from './pages/AddPostPage';
import CatagoriesPage from './pages/CatagoriesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import WalletPage from './pages/WalletPage';
import MarklistPage from './pages/MarklistPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

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
          <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="chat" element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="addpost" element={<ProtectedRoute><AddPostPage /></ProtectedRoute>} />
          <Route path="categories" element={<ProtectedRoute><CatagoriesPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
          <Route path="marklist" element={<ProtectedRoute><MarklistPage /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
