import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ScrollUp from './components/ScrollUp/ScrollUp';

/* Pages */
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SkillsPage from './pages/SkillsPage';
import BlogsPage from './pages/BlogsPage';
import ContactPage from './pages/ContactPage';

/* Admin */
import { AdminProvider } from './admin/AdminContext';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import ProtectedRoute from './admin/ProtectedRoute';
import Dashboard from './admin/pages/Dashboard';
import HomeAdmin from './admin/pages/HomeAdmin';
import AboutAdmin from './admin/pages/AboutAdmin';
import SkillsAdmin from './admin/pages/SkillsAdmin';
import BlogsAdmin from './admin/pages/BlogsAdmin';
import MessagesAdmin from './admin/pages/MessagesAdmin';

/* Admin CSS imports */
import './admin/AdminLayout.css';
import './admin/AdminModal.css';

function App() {
  return (
    <AdminProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(250, 29%, 14%)',
            color: 'hsl(250, 8%, 88%)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: 'hsl(250, 69%, 61%)', secondary: '#fff' } },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* ===== Public Portfolio Routes ===== */}
          <Route
            path="/*"
            element={
              <>
                <Header />
                <main className="main">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/skills" element={<SkillsPage />} />
                    <Route path="/blogs" element={<BlogsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                  </Routes>
                </main>
                <Footer />
                <ScrollUp />
              </>
            }
          />

          {/* ===== Admin Routes ===== */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="home" element={<HomeAdmin />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="skills" element={<SkillsAdmin />} />
            <Route path="blogs" element={<BlogsAdmin />} />
            <Route path="messages" element={<MessagesAdmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
