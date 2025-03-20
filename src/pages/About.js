import React from 'react';

function About() {
  return (
    <div className="container about-page">
      <div className="author-info">
        <div className="author-image">
          <img src="/images/author.png" alt="Author avatar" />
        </div>
        <div className="author-details">
          <h2>About the Author</h2>
          <p className="author-bio">
            Hello! I'm passionate about cooking and love sharing my favorite recipes with others. 
            My journey in cooking started from my family kitchen and has evolved into this 
            collection of carefully curated recipes that I'm excited to share with you.
          </p>
          <div className="author-contact">
            <h3>Get in Touch</h3>
            <p>Email: From.me.to.you.ask@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="about-the-app">
        <h2>About This Recipe Finder</h2>
        <p>
          Welcome to our Recipe Finder! This application is designed to help you discover 
          delicious recipes based on the ingredients you have at hand.
        </p>
        <h3>Features</h3>
        <ul>
          <li>Search recipes by ingredients</li>
          <li>Voice input for hands-free recipe search</li>
          <li>Text-to-speech recipe reading</li>
          <li>Browse recipes by categories</li>
          <li>Detailed cooking instructions</li>
          <li>Print-friendly recipe format</li>
        </ul>
      </div>
    </div>
  );
}

export default About; 