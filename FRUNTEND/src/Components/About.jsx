import React from 'react';
import { motion } from 'framer-motion';
import { Award, Palette, BookOpen } from 'lucide-react';
import "./styles/style.css";
const About = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Image Placeholder */}
          <div className=" img  h-96 bg-gray-200 rounded-xl shadow-2xl flex items-center justify-center relative overflow-hidden group">
             <div className="  absolute inset-0 bg-accent/20 group-hover:bg-transparent transition duration-500">
             </div>
    
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl font-serif text-orange-800 font-bold mb-6">The Artist & The Academic</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              As a <strong>B.Com. graduate</strong> and a <strong>state-level award-winning artist</strong>, I blend the discipline of commerce with the自由 expression of art.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Since 2017, I have created over <strong>1,000 paintings</strong> and led significant community initiatives, including large-scale wall paintings for the <strong>D.M. Office</strong>. My passion lies in preserving traditional arts like <strong>Mithila Painting</strong> while innovating by teaching unique paper craft techniques inspired by global styles.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border-orange-800  rounded-lg text-center border hover:border-accent transition">
                <Award className="w-8 text-orange-800 h-8 mx-auto text-accent mb-2" />
                <h3 className="font-bold text-orange-800  text-xl">State Award</h3>
                <p className="text-sm text-orange-800">Winner</p>
              </div>
              <div className="p-4 bg-gray-50 border-orange-800   rounded-lg text-center border hover:border-accent transition">
                <Palette className="w-8 h-8 mx-auto text-orange-800  text-accent mb-2" />
                <h3 className="font-bold text-orange-800 text-xl">1,000+</h3>
                <p className="text-sm text-orange-800">Paintings</p>
              </div>
              <div className="p-4 bg-gray-50 border-orange-800  rounded-lg text-center border hover:border-accent transition">
                <BookOpen className="w-8 text-orange-800 h-8 mx-auto text-accent mb-2" />
                <h3 className="font-bold text-orange-800">Educator</h3>
                <p className="text-sm text-orange-800">Since 2017</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;