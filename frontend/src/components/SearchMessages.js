import React, { useState } from 'react';
import { searchMessages } from '../api/auth';

const SearchMessages = ({ token }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await searchMessages(token, query);
    setResults(response.data);
  };

  return (
    <div>
      <h2>Search Messages</h2>
      <input
        type="text"
        placeholder="Search messages"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        {results.map((msg, index) => (
          <div key={index}>{msg.content}</div>
        ))}
      </div>
    </div>
  );
};

export default SearchMessages;
