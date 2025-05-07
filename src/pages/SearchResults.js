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
    const loadAndSearchRecipes = async () => {
      try {
        const categories = [
          { id: 'starters', subcategories: ['soups', 'kebabs', 'salads'] },
          { id: 'main-courses', subcategories: ['chicken', 'lamb', 'beef', 'mince', 'seafood', 'vegetables'] },
          { id: 'sides', subcategories: ['rice', 'bread', 'daal'] },
          { id: 'snacks', subcategories: [] },
          { id: 'desserts', subcategories: [] },
          { id: 'drinks', subcategories: [] },
          { id: 'indo-chinese-fusion', subcategories: [] }
        ];

        let allRecipes = [];

        // Load recipes from categories with no subcategories
        for (const category of categories) {
          if (category.subcategories.length === 0) {
            try {
              const response = await fetch(`/data/${category.id}/recipes.json`);
              const data = await response.json();
              allRecipes = [...allRecipes, ...data.recipes];
            } catch (err) {
              console.warn(`Could not load recipes for ${category.id}:`, err);
            }
          } else {
            // Load recipes from subcategories
            for (const subcategory of category.subcategories) {
              try {
                const response = await fetch(`/data/${category.id}/${subcategory}/recipes.json`);
                const data = await response.json();
                allRecipes = [...allRecipes, ...data.recipes];
              } catch (err) {
                console.warn(`Could not load recipes for ${category.id}/${subcategory}:`, err);
              }
            }
          }
        }

        // Filter recipes based on search query
        const searchTerms = query.toLowerCase().split(' ');
        const filteredRecipes = allRecipes.filter(recipe => {
          const recipeText = [
            recipe.name.toLowerCase(),
            ...recipe.ingredients.map(i => i.toLowerCase()),
            recipe.category.toLowerCase()
          ].join(' ');
          
          return searchTerms.every(term => recipeText.includes(term));
        })
        .map(recipe => ({
          ...recipe,
          imageUrl: recipe.image || recipe.imageUrl
        }));

        setRecipes(filteredRecipes);
        setLoading(false);
      } catch (err) {
        console.error('Error loading recipes:', err);
        setLoading(false);
      }
    };

    loadAndSearchRecipes();
  }, [query]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading">Searching for recipes...</div>
    </div>
  );

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