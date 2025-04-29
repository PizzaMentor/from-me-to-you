import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import headerImage from '../assets/header.png';

const Navbar = () => {
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
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      setIsListening(false);
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
      <div className="navbar-content">
        <div className="nav-left">
          <Link to="/" className="navbar-brand">
            <img src={headerImage} alt="From Me To You" className="header-image" />
          </Link>
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
          
          <Link to="/about" className="about-link">About</Link>
          <Link to="/add-recipe" className="about-link">Add</Link>
          
          <button 
            className={`voice-button ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
          >
            Voice
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 