import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminMessages = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [replyLoading, setReplyLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const isAdmin = user && (user.isAdmin === true || user.role === 'admin');

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
      fetchUnreadCount();
      // Refresh unread count every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, filterStatus, searchQuery]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      let queryString = '';
      if (filterStatus) queryString += `status=${filterStatus}&`;
      if (searchQuery) queryString += `search=${searchQuery}&`;

      const response = await axios.get(
        `${API_URL}/contact/messages?${queryString}limit=20`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessage({ type: 'error', text: 'Error loading messages' });
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/contact/unread-count`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    setReplyText('');
    
    // Mark as read if not already
    if (!msg.isRead) {
      try {
        await axios.put(`${API_URL}/contact/messages/${msg._id}/read`, {}, {
          withCredentials: true,
        });
        fetchUnreadCount();
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      setMessage({ type: 'error', text: 'Please enter a reply' });
      return;
    }

    try {
      setReplyLoading(true);
      const response = await axios.put(
        `${API_URL}/contact/messages/${selectedMessage._id}/reply`,
        { reply: replyText },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Reply sent successfully!' });
        setSelectedMessage(response.data.data);
        setReplyText('');
        fetchMessages();
        fetchUnreadCount();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Error sending reply',
      });
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await axios.delete(`${API_URL}/contact/messages/${msgId}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setMessage({ type: 'success', text: 'Message deleted' });
          setSelectedMessage(null);
          fetchMessages();
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Error deleting message' });
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-semibold">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages & Inquiries</h1>
          <div className="flex gap-4 items-center">
            <div className="bg-orange-100 px-4 py-2 rounded-lg">
              <span className="text-orange-800 font-semibold">
                {unreadCount} Unread
              </span>
            </div>
            <div className="bg-blue-100 px-4 py-2 rounded-lg">
              <span className="text-blue-800 font-semibold">
                {messages.length} Total
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="viewed">Viewed</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>

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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow">
            <div className="border-b px-4 py-3">
              <h2 className="font-semibold text-gray-800">Messages</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No messages found</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {messages.map(msg => (
                  <motion.div
                    key={msg._id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 border-b cursor-pointer transition-colors ${
                      selectedMessage?._id === msg._id
                        ? 'bg-orange-50 border-l-4 border-orange-600'
                        : 'hover:bg-gray-50'
                    } ${!msg.isRead ? 'bg-blue-50' : ''}`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-sm text-gray-800 truncate">
                        {msg.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          msg.status === 'new'
                            ? 'bg-red-100 text-red-700'
                            : msg.status === 'replied'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {msg.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{msg.email}</p>
                    <p className="text-xs text-gray-500 truncate mt-1">{msg.subject}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            {selectedMessage ? (
              <>
                <div className="border-b px-6 py-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedMessage.subject}</h2>
                      <p className="text-gray-600 mt-1">From: {selectedMessage.name}</p>
                      <p className="text-gray-600">{selectedMessage.email}</p>
                      {selectedMessage.phone && (
                        <p className="text-gray-600">Phone: {selectedMessage.phone}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          selectedMessage.category === 'General'
                            ? 'bg-gray-100 text-gray-700'
                            : selectedMessage.category === 'Collaboration'
                            ? 'bg-blue-100 text-blue-700'
                            : selectedMessage.category === 'Workshop'
                            ? 'bg-purple-100 text-purple-700'
                            : selectedMessage.category === 'Commission'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {selectedMessage.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Message Content */}
                <div className="px-6 py-4 border-b bg-gray-50">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {/* Reply Section */}
                {selectedMessage.reply && (
                  <div className="px-6 py-4 border-b bg-green-50">
                    <h3 className="font-semibold text-green-800 mb-2">Your Reply:</h3>
                    <p className="text-green-900 whitespace-pre-wrap">{selectedMessage.reply}</p>
                    <p className="text-sm text-green-700 mt-2">
                      Replied on: {new Date(selectedMessage.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Reply Form */}
                {!selectedMessage.isReplied && (
                  <div className="px-6 py-4 border-b">
                    <h3 className="font-semibold text-gray-800 mb-3">Send Reply</h3>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      disabled={replyLoading}
                      placeholder="Type your reply here..."
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-200"
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={replyLoading || !replyText.trim()}
                      className="mt-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                    >
                      {replyLoading ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                )}

                {/* Delete Button */}
                <div className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Delete Message
                  </button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Select a message to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
