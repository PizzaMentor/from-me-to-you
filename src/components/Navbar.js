import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const startListening = () => {
    setIsListening(true);
    // Initialize speech recognition
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      setIsListening(false);
      // Automatically search with the voice input
      navigate(`/search?q=${encodeURIComponent(transcript)}`);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    window.speechSynthesis.cancel();
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="navbar-brand">From Me To You</Link>
        <div className="category-links">
          <Link to="/category/starters">Starters</Link>
          <Link to="/category/main-courses">Main Courses</Link>
          <Link to="/category/sides">Sides</Link>
          <Link to="/category/desserts">Desserts</Link>
          <Link to="/category/drinks">Drinks</Link>
          <Link to="/category/indo-chinese-fusion">Indo Chinese Fusion</Link>
        </div>
      </div>

      <div className="nav-right">
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter ingredients..."
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        
        <button 
          className={`voice-button ${isListening ? 'listening' : ''}`}
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? 'Stop Voice Input' : 'Voice Input'}
        </button>
        
        <Link to="/about" className="about-link">About</Link>
      </div>
    </nav>
  );
}

export default Navbar; 