import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import "./styles/style.css";

const Hero = () => {
  return (
    <div className=" yehi min-h-screen flex items-center   from-gray-50 to-gray-200 pt-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary text-orange-800 mb-6 leading-tight">
            Art's & Craft's <span className="text-accent"></span> Activites
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            State-level award-winning artist blending academic discipline with traditional and modern art forms.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/gallery">
              <button className="  px-8 py-3 bg-primary text-white rounded-full hover:text-orange-200 hover:bg-accent transition duration-300 shadow-lg">
                View Gallery
              </button>
            </Link>
            <Link to="/contact">
              <button className="px-8 py-3 border-2 text-gray-400 font-bold border-white border-primary text-primary rounded-full hover:bg-primary hover:text-orange-200  transition duration-300">
                Get in Touch
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;