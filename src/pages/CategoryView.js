import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import RecipeDetail from '../components/RecipeDetail';

const categories = {
  'starters': {
    name: 'Starters',
    subcategories: ['soups', 'kebabs', 'snacks', 'salads']
  },
  'main-courses': {
    name: 'Main Courses',
    subcategories: ['chicken', 'lamb', 'beef', 'seafood', 'vegetables']
  },
  'sides': {
    name: 'Sides',
    subcategories: ['rice', 'bread', 'daal']
  },
  'desserts': {
    name: 'Desserts',
    subcategories: ['sweets']
  },
  'drinks': {
    name: 'Drinks',
    subcategories: ['beverages']
  },
  'indo-chinese-fusion': {
    name: 'Indo Chinese Fusion',
    subcategories: ['chicken', 'vegetarian']
  }
};

function CategoryView() {
  const { categoryId } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Convert categoryId to the correct format
  const normalizedCategoryId = categoryId?.toLowerCase().replace(/\s+/g, '-');
  const category = categories[normalizedCategoryId];

  useEffect(() => {
    fetch('/data/recipes.json')
      .then(res => res.json())
      .then(data => {
        const categoryRecipes = data.recipes.filter(recipe => {
          if (!selectedSubcategory) {
            // Exact match for category name
            return recipe.category === category.name;
          }
          // For subcategories, check if the recipe's category includes the subcategory name
          return recipe.category.toLowerCase().includes(selectedSubcategory.toLowerCase());
        });
        setRecipes(categoryRecipes);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading recipes:', err);
        setLoading(false);
      });
  }, [normalizedCategoryId, selectedSubcategory, category]);

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (!category) return <div className="no-results">Category not found</div>;

  return (
    <div className="container">
      <h1>{category.name}</h1>
      
      <div className="subcategories">
        {category.subcategories.map(sub => (
          <button
            key={sub}
            className={`subcategory-btn ${selectedSubcategory === sub ? 'active' : ''}`}
            onClick={() => setSelectedSubcategory(sub)}
          >
            {sub.charAt(0).toUpperCase() + sub.slice(1)}
          </button>
        ))}
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

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}

export default CategoryView; 