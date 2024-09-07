import React, { useState, useEffect } from 'react';
import { getMessages, deleteAllMessages } from '../api/auth';  // Ensure you add deleteAllMessages to your API module

const ChatBox = ({ token }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const createWebSocket = () => {
      const ws = new WebSocket(`ws://localhost:8000/ws/chat?token=${token}`);

      ws.onopen = () => {
        console.log('Connected to WebSocket');
      };

      ws.onmessage = (event) => {
        try {
          // Try parsing the message data as JSON
          const newMessage = JSON.parse(event.data);
          console.log('Received message:', newMessage);  // Log received message
          setChatHistory((prev) => [...prev, newMessage]);
        } catch (error) {
          // Handle errors for non-JSON data
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
        console.log('Fetched messages:', response.data);  // Log fetched messages
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

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.send(message);  // Send message as a plain text
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
      <div>
        {chatHistory.map((msg, index) => (
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
