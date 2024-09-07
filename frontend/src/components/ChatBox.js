import React, { useState, useEffect } from 'react';
import { getMessages, searchMessages, deleteAllMessages } from '../api/auth';
import './ChatBox.css'; // Import the CSS file for styling

const ChatBox = ({ token, currentUser }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);

  useEffect(() => {
    const createWebSocket = () => {
      const ws = new WebSocket(`ws://localhost:8000/ws/chat?token=${token}`);

      ws.onopen = () => {
        console.log('Connected to WebSocket');
      };

      ws.onmessage = (event) => {
        try {
          const newMessage = JSON.parse(event.data);
          console.log('Received message:', newMessage);
          setChatHistory((prev) => [...prev, newMessage]);
        } catch (error) {
          console.error('Failed to parse message as JSON:', event.data);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket closed. Reconnecting...');
        setTimeout(createWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      setSocket(ws);
    };

    createWebSocket();

    const fetchMessages = async () => {
      try {
        const response = await getMessages(token);
        console.log('Fetched messages:', response.data);
        setChatHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [token]);

  useEffect(() => {
    const fetchFilteredMessages = async () => {
      if (searchQuery.trim()) {
        try {
          const response = await searchMessages(token, searchQuery);
          console.log('Search results:', response.data);
          setFilteredMessages(response.data);
        } catch (error) {
          console.error('Failed to search messages:', error);
        }
      } else {
        setFilteredMessages([]);
      }
    };

    fetchFilteredMessages();
  }, [searchQuery, token]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.send(message);
      setMessage('');
    }
  };

  const handleDeleteAllMessages = async () => {
    try {
      await deleteAllMessages(token);
      setChatHistory([]); // Clear the chat history
    } catch (error) {
      console.error('Failed to delete messages:', error);
    }
  };

  return (
    <div className="chatbox-container">
      <h2 className="chatbox-title">Chat</h2>
      <div className="chatbox-actions">
        <button onClick={handleDeleteAllMessages} className="chatbox-button">Delete All Messages</button>
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="chatbox-search"
        />
      </div>
      <div className="chatbox-history">
        {(searchQuery.trim() ? filteredMessages : chatHistory).map((msg, index) => (
          <div
            key={index}
            className={`chatbox-message ${msg.username === currentUser ? 'current-user' : 'other-user'}`}
          >
            <p>
              <strong>{msg.username === currentUser ? 'You' : msg.username}:</strong> {msg.content}
            </p>
          </div>
        ))}
      </div>
      <div className="chatbox-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="chatbox-message-input"
        />
        <button onClick={sendMessage} className="chatbox-send-button">Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
