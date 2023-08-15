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
import PostsPage from './pages/PostsPage/PostsPage.jsx';
import Navbar from './components/navbar/Navbar';
import Profile from './components/user/profile';
import Search from './components/search/Search';
import PostsByCategory from './pages/CategoriesPage/PostsByCategory';
import { useLocation } from 'react-router-dom';
import PostDetail from './components/post/PostDetail'

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/" />;
  }
  return children;
};


function MainContent() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  const pathsWithoutContainerClass = ["/", "/register", "/transition"];

  // If the current path is in the pathsWithoutContainerClass array, directly render Routes
  if (pathsWithoutContainerClass.includes(location.pathname)) {
    return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={currentUser ? <Navigate to="/home" /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transition" element={<TransitionPage />} />
      </Routes>
    );
  }

  return (
    <>
    <div className="app-wrapper">
    <div className='page-content-container'>
      <div className="page-content-wrapper">
        <div className='global-component-background'></div>
      <Routes>
        {/* Protected Routes */}
        <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/addpost' element={<ProtectedRoute><AddPostPage /></ProtectedRoute>} />
        <Route path='/categories' element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path='/wallet' element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
        <Route path='/marklist' element={<ProtectedRoute><MarklistPage /></ProtectedRoute>} />
        <Route path='/settings' element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path='/chat' element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />
        <Route path='/posts' element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
        <Route path="/posts-by-category/:optionId" element={<ProtectedRoute><PostsByCategory /></ProtectedRoute>} />
        <Route path="/post-detail/:postId" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />

      </Routes>
      </div>
      </div>
      </div>
    </>

  );
}

function GlobalComponents() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  // Check paths where global components shouldn't be rendered
  const hideGlobalComponentsOn = ["/login", "/register", "/transition"];
  
  // Determine if global components should be displayed
  const shouldShowGlobalComponents = currentUser && !hideGlobalComponentsOn.includes(location.pathname);

  if (!shouldShowGlobalComponents) return null;

  return (
    <>
      <Navbar />
      <Profile />
      <Search />
    </>
  );
}



// Your App component remains mostly unchanged
function App() {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return null; // Or a loading spinner or any other placeholder component
  }

  return (
    <Router>
      <div className='app-container'>
          <GlobalComponents />
              <MainContent />      
      </div>
    </Router>
  );
}

export default App

