import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import RecipeDetail from '../components/RecipeDetail';

const categories = {
  'starters': {
    name: 'Starters',
    subcategories: ['soups', 'kebabs', 'salads']
  },
  'main-courses': {
    name: 'Main Courses',
    subcategories: ['chicken', 'lamb', 'beef', 'mince', 'seafood', 'vegetables']
  },
  'sides': {
    name: 'Sides',
    subcategories: ['rice', 'bread', 'daal']
  },
  'snacks': {
    name: 'Snacks',
    subcategories: []
  },
  'desserts': {
    name: 'Desserts',
    subcategories: []
  },
  'drinks': {
    name: 'Drinks',
    subcategories: []
  },
  'indo-chinese-fusion': {
    name: 'Indo Chinese Fusion',
    subcategories: []
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
    const loadRecipes = async () => {
      try {
        if (category.subcategories.length === 0) {
          // For categories with no subcategories, load directly from the category folder
          try {
            const response = await fetch(`/data/${normalizedCategoryId}/recipes.json`);
            const data = await response.json();
            setRecipes(data.recipes);
          } catch (err) {
            console.error(`Could not load recipes for ${normalizedCategoryId}:`, err);
            setRecipes([]);
          }
        } else if (!selectedSubcategory) {
          // Load all recipes from all subcategories
          const allRecipes = [];
          for (const subcategory of category.subcategories) {
            try {
              const response = await fetch(`/data/${normalizedCategoryId}/${subcategory}/recipes.json`);
              const data = await response.json();
              allRecipes.push(...data.recipes);
            } catch (err) {
              console.warn(`Could not load recipes for ${subcategory}:`, err);
            }
          }
          setRecipes(allRecipes);
        } else {
          // Load recipes from specific subcategory
          const response = await fetch(`/data/${normalizedCategoryId}/${selectedSubcategory}/recipes.json`);
          const data = await response.json();
          setRecipes(data.recipes);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading recipes:', err);
        setLoading(false);
      }
    };

    if (category) {
      loadRecipes();
    }
  }, [normalizedCategoryId, selectedSubcategory, category]);

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (!category) return <div className="no-results">Category not found</div>;

  return (
    <div className="container">
      <h1>{category.name}</h1>
      
      {category.subcategories.length > 0 && (
        <div className="subcategories">
          <button
            className={`subcategory-btn ${!selectedSubcategory ? 'active' : ''}`}
            onClick={() => setSelectedSubcategory(null)}
          >
            All
          </button>
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
      )}

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