import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import RecipeDetail from '../components/RecipeDetail';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get('q');

  useEffect(() => {
    fetch('/data/recipes.json')
      .then(res => res.json())
      .then(data => {
        const filteredRecipes = data.recipes.filter(recipe => {
          const searchTerms = query.toLowerCase().split(' ');
          const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());
          return searchTerms.some(term =>
            recipeIngredients.some(ingredient => ingredient.includes(term))
          );
        });
        setRecipes(filteredRecipes);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading recipes:', err);
        setLoading(false);
      });
  }, [query]);

  if (loading) return <div className="loading">Searching recipes...</div>;

  return (
    <div className="container">
      <h1>Search Results</h1>
      <p className="search-info">Found {recipes.length} recipes matching "{query}"</p>
      
      {recipes.length === 0 ? (
        <div className="no-results">No recipes found. Try different ingredients!</div>
      ) : (
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={setSelectedRecipe}
            />
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}

export default SearchResults; 