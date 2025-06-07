import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Sidebar from '../views/Sidebar';
import Button from '../components/Button';
import MessageBubble from '../components/MessageBubble';

const Messaging = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (selectedChat && user) {
      const q = query(
        collection(db, `chats/${selectedChat.id}/messages`),
        orderBy('timestamp', 'asc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
      });
      return () => unsubscribe();
    }
  }, [selectedChat, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat || !user) return;

    try {
      await addDoc(collection(db, `chats/${selectedChat.id}/messages`), {
        text: message,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        timestamp: new Date(),
      });
      setMessage('');
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const mockChats = [
    { id: 'chat1', name: 'Startup XYZ', lastMessage: 'Hey, interested in our project?' },
    { id: 'chat2', name: 'Alice (Student)', lastMessage: 'Can we discuss the timeline?' },
  ];

  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-blue-600">Messaging</h1>
          </div>
        </header>
        <main className="flex-1 flex">
          {/* Conversation List */}
          <div className="w-1/3 bg-white border-r border-gray-200 p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Chats</h2>
            {mockChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedChat?.id === chat.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold text-gray-800">{chat.name}</p>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>
            ))}
          </div>
          {/* Chat Window */}
          <div className="w-2/3 flex flex-col">
            {selectedChat ? (
              <>
                <div className="bg-blue-600 text-white p-4">
                  <h3 className="text-lg font-semibold">{selectedChat.name}</h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg.text}
                      isSender={msg.senderId === user.uid}
                      senderName={msg.senderName}
                      timestamp={msg.timestamp}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Type a message..."
                  />
                  <Button
                    text="Send"
                    className="ml-2 bg-blue-600 text-white hover:bg-blue-700"
                    type="submit"
                  />
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-600">
                Select a chat to start messaging
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messaging;