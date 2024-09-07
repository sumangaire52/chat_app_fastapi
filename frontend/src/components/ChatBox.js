import React, { useState, useEffect } from 'react';
import { getMessages, searchMessages, deleteAllMessages } from '../api/auth';

const ChatBox = ({ token }) => {
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
      setChatHistory([]);  // Clear the chat history
    } catch (error) {
      console.error('Failed to delete messages:', error);
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <button onClick={handleDeleteAllMessages}>Delete All Messages</button>
      <input
        type="text"
        placeholder="Search messages..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div>
        {(searchQuery.trim() ? filteredMessages : chatHistory).map((msg, index) => (
          <div key={index}>
            <p><strong>{msg.username}:</strong> {msg.content}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
