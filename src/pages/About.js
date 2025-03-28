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
            I love all kinds of food—there are very few things I don't like to eat. As an Indian, Indian food is my staple. I 
            can eat it anytime, in any amount, and never get tired of it.
            When I was younger, I had a saying that people thought was a joke. Whenever someone caused drama or it was a "filmy" 
            situation, I would say, "One day, when I'm older and have lots of money, I'll make a movie out of this. And if I 
            don't have enough money, I'll write a book instead." Well… here we are.
          </p>
          <div className="author-contact">
            <h3>Get in Touch</h3>
            <p>Email: From.me.to.you.ask@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="author-info story-section">
        <div className="story-content">
          <h2>Why I Made This Book - turned Website</h2>
          <p className="author-bio">
            Five years after my marriage, we settled in the UK due to my husband's job. That's when I noticed something strange 
            about the restaurants here—especially the Indian ones. Every Indian restaurant seems to serve the same predictable 
            Chicken Tikka Masala. Their idea of dal is so thick and covered in ghee, it could probably set like jelly when it 
            gets cold. Or korma—which tastes more like dessert, filled with cream and sugar, and just for fun, they toss in 
            some chicken.
          </p>
          <p className="author-bio">
            And don't get me started on the so-called Indian desserts—most taste like face cream. Bleurgh.
          </p>
          <p className="author-bio">
            It was then I realised something that genuinely worried me: If this is what passes for Indian food abroad, my kids 
            might grow up never knowing what real Indian food actually tastes like—at least not when I'm not around.
          </p>
          <p className="author-bio">
            That's the reason I made this book. It's my way of passing down everything I know to my children—preserving 
            flavours, traditions, and the love that goes into home cooking. While this book barely scratches the surface of 
            all I've learned over the years, think of it as a foundation. A starting point for understanding and loving 
            Indian food.
          </p>
          <p className="author-bio">
            I've tried to include recipes from all over India, though you'll find a lot of northern dishes—because that's 
            what we cook most at home. Both of my kids love the taste of my food, and I've poured my heart into this book, 
            sharing many of my absolute favourite recipes.
          </p>
          <p className="author-bio">
            This book tells the story of the food I can't live without, the country I come from, and the people I share my 
            life with.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About; 