import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'Other',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = ['General', 'Collaboration', 'Workshop', 'Commission', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Please enter your name' });
      return;
    }

    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email' });
      return;
    }

    if (!formData.subject.trim()) {
      setMessage({ type: 'error', text: 'Please enter a subject' });
      return;
    }

    if (!formData.message.trim()) {
      setMessage({ type: 'error', text: 'Please enter your message' });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/contact/send`, formData);

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Message sent successfully! We will get back to you soon.' });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          category: 'Other',
        });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 5000);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Error sending message. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl text-orange-800 font-serif font-bold text-center mb-12">Get In Touch</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <p className="text-lg text-orange-800 mb-6 leading-relaxed">
              Interested in a collaboration, purchasing artwork, or booking a workshop? 
              Feel free to reach out and share your thoughts.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12  text-orange-800 bg-gray-100 rounded-full flex items-center justify-center text-accent">
                <Mail />
              </div>
              <div>
                <h4 className="font-bold text-orange-800">Email</h4>
                <p className="text-gray-600">anuradhavikramsoni@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 text-orange-800 rounded-full flex items-center justify-center text-accent">
                <Phone />
              </div>
              <div>
                <h4 className="font-bold text-orange-800">Phone</h4>
                <p className="text-gray-600">+91-7349988027</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 text-orange-800 rounded-full flex items-center justify-center text-accent">
                <MapPin />
              </div>
              <div>
                <h4 className="font-bold text-orange-800">Studio</h4>
                <p className="text-gray-600">Mithila Art Center, India</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-8 rounded-xl shadow-sm">
            {/* Message Alert */}
            {message.text && (
              <div
                className={`p-4 rounded-lg mb-4 ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">Name *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full p-3 border border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-600 outline-none disabled:bg-gray-200" 
                placeholder="Your Name" 
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">Email *</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full p-3 border border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-600 outline-none disabled:bg-gray-200" 
                placeholder="Your Email" 
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">Phone</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full p-3 border border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-600 outline-none disabled:bg-gray-200" 
                placeholder="Your Phone (Optional)" 
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full p-3 border border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-600 outline-none disabled:bg-gray-200"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">Subject *</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full p-3 border border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-600 outline-none disabled:bg-gray-200" 
                placeholder="Message Subject" 
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">Message *</label>
              <textarea 
                rows="4" 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full p-3 border border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-600 outline-none disabled:bg-gray-200" 
                placeholder="Your Message"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-3 rounded-lg transition duration-300 font-bold"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;