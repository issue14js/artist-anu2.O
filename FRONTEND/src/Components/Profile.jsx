import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase, Award, Link2, Edit, Save, X, LogOut, Upload, Camera } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './styles/style.css';

const API_URL = import.meta.env.VITE_API_URL ;

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser, logout } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    location: '',
    skills: '',
    website: '',
    specialization: '',
    experience: 0,
    portfolioLink: '',
    avatar: '',
  });

  const isOwnProfile = id ? false : true;

  // Protect route - redirect if not logged in and trying to access own profile
  useEffect(() => {
    if (!id && !authUser) {
      navigate('api/auth/login');
    }
  }, [id, authUser, navigate]);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const endpoint = id ? `/api/profile/${id}` : '/api/profile/current/me';
      const res = await axios.get(`${API_URL}${endpoint}`, {
        withCredentials: true,
      });
      setProfile(res.data.user);
      setFormData({
        name: res.data.user.name || '',
        bio: res.data.user.bio || '',
        phone: res.data.user.phone || '',
        location: res.data.user.location || '',
        skills: Array.isArray(res.data.user.skills) ? res.data.user.skills.join(', ') : '',
        website: res.data.user.website || '',
        specialization: res.data.user.specialization || '',
        experience: res.data.user.experience || 0,
        portfolioLink: res.data.user.portfolioLink || '',
        avatar: res.data.user.avatar || '',
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const updateData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
        experience: parseInt(formData.experience),
      };

      const res = await axios.put(`${API_URL}/api/profile/update`, updateData, {
        withCredentials: true,
      });

      setProfile(res.data.user);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: profile.name || '',
      bio: profile.bio || '',
      phone: profile.phone || '',
      location: profile.location || '',
      skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
      website: profile.website || '',
      specialization: profile.specialization || '',
      experience: profile.experience || 0,
      portfolioLink: profile.portfolioLink || '',
      avatar: profile.avatar || '',
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result;
      setFormData({
        ...formData,
        avatar: base64String,
      });
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2 bg-orange-800 text-white rounded-lg hover:bg-orange-900"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-red from-orange-800 to-orange-600"></div>

          {/* Profile Content */}
          <div className="px-6 md:px-12 pb-12">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 -mt-16 relative z-10 mb-8">
              {/* Avatar and Basic Info */}
              <div className="flex items-center gap-6">
                <div 
                  className={`w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center overflow-hidden ${isEditing && isOwnProfile ? 'cursor-pointer group relative' : ''}`}
                  onClick={isEditing && isOwnProfile ? triggerFileUpload : undefined}
                >
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                  {isEditing && isOwnProfile && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile?.name}</h1>
                  {profile?.specialization && (
                    <p className="text-orange-800 font-semibold">{profile.specialization}</p>
                  )}
                  {profile?.experience > 0 && (
                    <p className="text-gray-600">{profile.experience} years experience</p>
                  )}
                </div>
              </div>

              {/* Edit and Logout Buttons */}
              {isOwnProfile && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-6 py-2 bg-orange-800 text-white rounded-lg hover:bg-orange-900 transition"
                  >
                    {isEditing ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {error && isEditing && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {isEditing ? (
              // Edit Mode
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      placeholder="e.g., Mithila Painting, Digital Art"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g., Painting, Drawing, Teaching"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Tell us about yourself"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Portfolio Link
                  </label>
                  <input
                    type="url"
                    name="portfolioLink"
                    value={formData.portfolioLink}
                    onChange={handleInputChange}
                    placeholder="Link to your portfolio"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Avatar (or paste image URL)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={triggerFileUpload}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar.startsWith('data:') ? '' : formData.avatar}
                    onChange={handleInputChange}
                    placeholder="Or paste image URL here"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-800"
                  />
                  {formData.avatar && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <img src={formData.avatar} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover border-2 border-orange-800" />
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition flex-1"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex-1"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              // View Mode
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Bio Section */}
                {profile?.bio && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
                    <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="text-orange-800 w-5 h-5" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-gray-900">{profile?.email}</p>
                      </div>
                    </div>
                    {profile?.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="text-orange-800 w-5 h-5" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="text-gray-900">{profile.phone}</p>
                        </div>
                      </div>
                    )}
                    {profile?.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="text-orange-800 w-5 h-5" />
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="text-gray-900">{profile.location}</p>
                        </div>
                      </div>
                    )}
                    {profile?.website && (
                      <div className="flex items-center gap-3">
                        <Link2 className="text-orange-800 w-5 h-5" />
                        <div>
                          <p className="text-sm text-gray-600">Website</p>
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-orange-800 hover:underline">
                            Visit Website
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {profile?.specialization && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="text-orange-800 w-5 h-5" />
                        <h3 className="font-bold text-gray-900">Specialization</h3>
                      </div>
                      <p className="text-gray-600">{profile.specialization}</p>
                    </div>
                  )}

                  {profile?.experience > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="text-orange-800 w-5 h-5" />
                        <h3 className="font-bold text-gray-900">Experience</h3>
                      </div>
                      <p className="text-gray-600">{profile.experience} years</p>
                    </div>
                  )}
                </div>

                {/* Skills */}
                {profile?.skills && profile.skills.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
                    <div className="flex flex-wrap gap-3">
                      {profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Portfolio Link */}
                {profile?.portfolioLink && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Portfolio</h2>
                    <a
                      href={profile.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2 bg-orange-800 text-white rounded-lg hover:bg-orange-900 transition"
                    >
                      View Portfolio
                    </a>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
