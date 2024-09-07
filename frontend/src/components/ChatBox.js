import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getMessages } from '../api/auth';

const ChatBox = ({ token }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const socket = io('ws://localhost:8000/ws/chat', {
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    socket.on('message', (msg) => {
      setChatHistory((prev) => [...prev, msg]);
    });

    setSocket(socket);

    // Fetch past messages
    const fetchMessages = async () => {
      const response = await getMessages(token);
      setChatHistory(response.data);
    };

    fetchMessages();

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const sendMessage = () => {
    socket.emit('message', message);
    setMessage('');
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {chatHistory.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
