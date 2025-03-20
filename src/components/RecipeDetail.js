import React, { useState } from 'react';

function RecipeDetail({ recipe, onClose }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  const speakRecipe = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    } else {
      const text = `${recipe.name}. ${recipe.description}. 
        Ingredients: ${recipe.ingredients.join(', ')}. 
        Instructions: ${recipe.instructions.join('. ')}`;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
    setIsSpeaking(!isSpeaking);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose} aria-label="Close recipe">
          ×
        </button>
        
        <div className="recipe-detail">
          <img 
            src={recipe.image || '/images/placeholder-recipe.jpg'} 
            alt={recipe.name}
            className="recipe-detail-image"
          />
          
          <div className="recipe-detail-header">
            <h2>{recipe.name}</h2>
            <div className="recipe-meta">
              <span className="recipe-category">{recipe.category}</span>
              <span className="recipe-time">
                <i className="far fa-clock"></i> {recipe.cookingTime || '30-45'} mins
              </span>
              <span className="recipe-servings">
                <i className="fas fa-users"></i> {recipe.servings || '4'} servings
              </span>
            </div>
          </div>

          <p className="recipe-description">
            {recipe.description || `A delicious ${recipe.category.toLowerCase()} recipe that's perfect for any occasion.`}
          </p>

          <div className="recipe-sections">
            <div className="ingredients-section">
              <h3><i className="fas fa-list"></i> Ingredients</h3>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="instructions-section">
              <h3><i className="fas fa-utensils"></i> Instructions</h3>
              <ol>
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="recipe-actions">
            <button 
              className={`speak-button ${isSpeaking ? 'speaking' : ''}`}
              onClick={speakRecipe}
            >
              <i className="fas fa-volume-up"></i>
              {isSpeaking ? 'Stop Speaking' : 'Read Recipe'}
            </button>
            <button className="print-button">
              <i className="fas fa-print"></i> Print Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail; 