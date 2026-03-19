import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './Components/Profile';
import AdminPostUpload from './Components/AdminPostUpload';
import AdminMessages from './Components/AdminMessages';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="font-sans w-full overflow-hidden text-primary">
          <Navbar />
          
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <About />
                <Gallery />
                <Contact />
                
              </>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
          </Routes>

          <Footer />
          <AdminPostUpload />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;