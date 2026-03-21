import React from 'react';
import { Palette, Instagram, Facebook, Twitter, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="text-accent w-8 h-8" />
              <span className="text-2xl font-serif font-bold">Annu Kumari</span>
            </div>
            <p className="text-orange-800 mb-6 max-w-md">
              Blending academic discipline with creative expression. 
              Dedicated to preserving traditional arts like Mithila Painting 
              while inspiring the next generation.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/vikram_radha2024/?utm_source=ig_web_button_share_sheet" className="w-10 h-10 bg-orange-800 rounded-full flex items-center justify-center hover:bg-accent transition duration-300">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/share/18Nd4Uy143/" className="w-10 h-10 bg-orange-800 rounded-full flex items-center justify-center hover:bg-accent transition duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-orange-800 rounded-full flex items-center justify-center hover:bg-accent transition duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl text-orange-800 font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-orange-800">
              <li><a href="/" className=" hover:text-accent transition">Home</a></li>
              <li><a href="/about" className=" hover:text-accent transition">About Me</a></li>
              <li><a href="/gallery" className=" hover:text-accent transition">Gallery</a></li>
              <li><a href="/contact" className=" hover:text-accent transition">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-4 text-orange-800">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent" />
                <span>anuradhavikramsoni@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-orange-800">
                <Phone size={18} className="text-accent" />
                <span>+91 7349988027</span>
              </li>
              <li className="text-orange-800 mt-2">
                Mithila Art Center<br />
                Darbhanga, Bihar, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-orange-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-orange-800 text-sm">
            &copy; {currentYear} Annu Kumari. All rights reserved.
          </p>
          <p className="text-orange-800 text-sm mt-2 md:mt-0">
            Designed with <span className="text-accent">♥</span> ISSUE.TECH
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;