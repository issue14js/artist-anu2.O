import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import "./styles/style.css";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Traditional", "Education", "Painting", "Wall Art", "Learning", "Other"];

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const queryParam = selectedCategory === "All" ? "" : `?category=${selectedCategory}`;
      const response = await axios.get(`${API_URL}/posts${queryParam}`);

      if (response.data.success && response.data.data.length > 0) {
        // Map backend posts to gallery format with proper image URL
        const posts = response.data.data.map(post => ({
          _id: post._id,
          title: post.title,
          category: post.category,
          description: post.description,
          imageUrl: post.imageUrl.startsWith('http') 
            ? post.imageUrl 
            : `${API_URL.replace('/api', '')}${post.imageUrl}`,
          views: post.views,
          createdAt: post.createdAt,
        }));

        setArtworks(posts);
      } else {
        setArtworks([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-orange-800 font-bold mb-4">Works & Certificates</h2>
          <p className="text-gray-600">A glimpse into the collection of 1,000+ creations.</p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8 gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-600">Loading gallery...</div>
          </div>
        ) : artworks.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500 text-lg">No artworks available yet</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {artworks.map((art, index) => (
              <motion.div
                key={art._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="h-80 rounded-xl shadow-md overflow-hidden relative group cursor-pointer"
              >
                <img 
                  src={art.imageUrl} 
                  alt={art.title} 
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-transparant from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
                  <h3 className="text-white text-xl font-bold">{art.title}</h3>
                  <p className="text-gray-200 text-sm">{art.category}</p>
                  {art.description && (
                    <p className="text-gray-300 text-xs mt-2 line-clamp-2">{art.description}</p>
                  )}
                  {art.views !== undefined && (
                    <p className="text-gray-400 text-xs mt-2">Views: {art.views}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12"></div>
      </div>
    </div>
  );
};

export default Gallery;     