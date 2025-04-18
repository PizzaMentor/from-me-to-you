import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import RecipeDetail from '../components/RecipeDetail';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [dailyRecipes, setDailyRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to get today's seed for consistent daily selection
  const getTodaySeed = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  };

  useEffect(() => {
    const loadAllRecipes = async () => {
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

        // Set all recipes
        setRecipes(allRecipes);

        // Set daily recipes using today's date as seed
        const todaySeed = getTodaySeed();
        const seededRandom = [...allRecipes].sort((a, b) => {
          const hash = (str) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          return hash(a.name + todaySeed) - hash(b.name + todaySeed);
        });
        
        setDailyRecipes(seededRandom.slice(0, 6));
        setLoading(false);
      } catch (err) {
        console.error('Error loading recipes:', err);
        setLoading(false);
      }
    };

    loadAllRecipes();
  }, []);

  if (loading) return (
    <div className="loading-container">
      <div className="loading">Loading your delicious recipes...</div>
    </div>
  );

  return (
    <div className="container">
      <section className="daily-recipes-section">
        <div className="section-title-container">
          <h2 className="section-title">Recipes of the Day</h2>
          <div className="section-subtitle">Fresh picks for {new Date().toLocaleDateString()}</div>
        </div>
        <div className="recipe-grid">
          {dailyRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={setSelectedRecipe}
            />
          ))}
        </div>
      </section>

      <section className="all-recipes-section">
        <div className="section-title-container">
          <h2 className="section-title">All Recipes</h2>
        </div>
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={setSelectedRecipe}
            />
          ))}
        </div>
      </section>

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