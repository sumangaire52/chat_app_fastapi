import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ChatBox from './components/ChatBox';
import SearchMessages from './components/SearchMessages';

function App() {
  const [token, setToken] = useState('');

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route ("/") points to the Login page */}
          <Route path="/" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />

          {/* Conditionally render chat and search only if the user is authenticated */}
          {token && (
            <>
              <Route path="/chat" element={<ChatBox token={token} />} />
              <Route path="/search" element={<SearchMessages token={token} />} />
            </>
          )}

          {/* If user tries to access /chat or /search without a token, redirect to login */}
          <Route
            path="/chat"
            element={!token ? <Navigate to="/" replace /> : <ChatBox token={token} />}
          />
          <Route
            path="/search"
            element={!token ? <Navigate to="/" replace /> : <SearchMessages token={token} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
