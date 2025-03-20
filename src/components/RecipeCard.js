import React from 'react';

function RecipeCard({ recipe, onSelect }) {
  return (
    <div className="recipe-card" onClick={() => onSelect(recipe)}>
      <img 
        src={recipe.image || '/images/placeholder-recipe.jpg'} 
        alt={recipe.name}
        className="recipe-image"
      />
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.name}</h3>
        <p className="recipe-category">{recipe.category}</p>
        <p className="recipe-description">
          {recipe.description || `A delicious ${recipe.category.toLowerCase()} recipe with ${recipe.ingredients.length} ingredients.`}
        </p>
        <div className="recipe-meta">
          <span className="recipe-time">
            <i className="far fa-clock"></i> {recipe.cookingTime || '30-45'} mins
          </span>
          <span className="recipe-servings">
            <i className="fas fa-users"></i> {recipe.servings || '4'} servings
          </span>
        </div>
        <button className="view-button">
          View Recipe
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default RecipeCard; 