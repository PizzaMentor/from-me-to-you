import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import RecipeDetail from '../components/RecipeDetail';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/recipes.json')
      .then(res => res.json())
      .then(data => {
        setRecipes(data.recipes);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading recipes:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading recipes...</div>;

  return (
    <div className="container">
      <h1>Featured Recipes</h1>
      <div className="recipe-grid">
        {recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onSelect={setSelectedRecipe}
          />
        ))}
      </div>
      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}

export default Home; 