import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Recommended context path
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = { /* Your Firebase config */ };
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const Messaging = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [contacts, setContacts] = useState([]);
  const socket = io('http://localhost:5001', { autoConnect: !!user });

  useEffect(() => {
    if (user) {
      // Join socket room for real-time messages
      socket.emit('join', user.uid);

      socket.on('message', (message) => {
        setMessages((prev) => [...prev, message]);
        toast.success('New message received!');
      });

      // Fetch contacts
      axios.get(`http://localhost:5001/api/messages/${user.uid}/contacts`, {
        headers: { Authorization: `Bearer ${user.getIdToken()}` },
      }).then(({ data }) => setContacts(data));

      // Fetch all messages
      axios.get(`http://localhost:5001/api/messages/${user.uid}`, {
        headers: { Authorization: `Bearer ${user.getIdToken()}` },
      }).then(({ data }) => setMessages(data));

      // FCM setup for push notifications
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' }).then((token) => {
            axios.put(
              `http://localhost:5001/api/users/profile/${user.uid}`,
              { fcmToken: token },
              { headers: { Authorization: `Bearer ${user.getIdToken()}` } }
            );
          });
        }
      });

      // Foreground FCM notifications
      onMessage(messaging, ({ notification }) => {
        toast.success(notification?.body || 'New notification');
      });
    }
    return () => socket.disconnect();
  }, [user, socket]);

  const handleSend = async () => {
    if (!content.trim()) {
      toast.error('Message cannot be empty');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5001/api/messages',
        { receiverId, projectId, content },
        { headers: { Authorization: `Bearer ${user.getIdToken()}` } }
      );
      setContent('');
      toast.success('Message sent!');
    } catch {
      toast.error('Failed to send message');
    }
  };

  // Dynamic chat selection and fallback avatar/name
  const renderContacts = () =>
    contacts.map((contact) => (
      <li
        key={contact._id}
        className={`flex items-center p-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-pink-700 transition-colors ${
          receiverId === contact._id ? 'ring-2 ring-pink-600' : ''
        }`}
        onClick={() => setReceiverId(contact._id)}
        tabIndex={0}
        aria-label={`Open chat with ${contact.name || 'User'}`}
        onKeyPress={(e) => (e.key === 'Enter' ? setReceiverId(contact._id) : null)}
      >
        <FaUserCircle className="text-2xl text-pink-600 mr-2" />
        <span className="font-semibold">{contact.name || 'User'}</span>
      </li>
    ));

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-blue-950 text-white">
      <Helmet>
        <title>CollabKart Messaging</title>
        <meta name="description" content="Secure, real-time messaging between VNIT students and startups on CollabKart." />
      </Helmet>
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          {/* Sidebar - Conversations List */}
          <aside className="md:w-1/3 w-full bg-gray-800 rounded-xl p-6 shadow-neon">
            <h3 className="text-xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
              Conversations
            </h3>
            <ul className="space-y-2">{renderContacts()}</ul>
          </aside>
          {/* Chat Section */}
          <div className="md:w-2/3 w-full bg-gray-800 rounded-xl p-6 shadow-neon">
            <h3 className="text-xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
              Chat
            </h3>
            <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-900 rounded-lg">
              {!receiverId ? (
                <div className="text-gray-400 text-center py-24">
                  Select a conversation to start messaging.
                </div>
              ) : (
                messages
                  .filter(
                    (m) =>
                      (m.senderId._id === user.uid && m.receiverId._id === receiverId) ||
                      (m.senderId._id === receiverId && m.receiverId._id === user.uid)
                  )
                  .map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${msg.senderId._id === user.uid ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg shadow-md animate-fade-in ${
                          msg.senderId._id === user.uid
                            ? 'bg-gradient-to-r from-pink-600 to-purple-700 text-white border-2 border-pink-600'
                            : 'bg-gray-700 text-gray-300 border border-purple-700'
                        }`}
                        aria-label={`Message from ${msg.senderId.name || 'User'}: ${msg.content}`}
                      >
                        <p className="text-base">{msg.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
            {/* Message Input */}
            {receiverId && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="mt-4 flex space-x-2"
              >
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="flex-1 p-3 bg-gray-900 text-white rounded border border-pink-600 focus:ring-2 focus:ring-purple-700 transition"
                  placeholder="Type a message..."
                  aria-label="Type your message"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-pink-600 to-purple-700 text-white p-3 rounded hover:scale-105 shadow-neon transition-transform"
                  aria-label="Send message"
                >
                  <FaPaperPlane size={20} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Messaging;
