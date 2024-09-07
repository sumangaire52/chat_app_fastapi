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

          {/* Redirect to login if not authenticated */}
          <Route
            path="/chat"
            element={token ? <ChatBox token={token} /> : <Navigate to="/" replace />}
          />
          <Route
            path="/search"
            element={token ? <SearchMessages token={token} /> : <Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
