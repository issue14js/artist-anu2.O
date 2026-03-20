import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import About from './Components/About';
import Gallery from './Components/Gallery';
import Contact from './Components/Contact';
import Footer from './Components/Footer';
import Login from './Components/Login';
import Signup from './Components/Signup';
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
                <Footer/>
                
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

          
          <AdminPostUpload />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;