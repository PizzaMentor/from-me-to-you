import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    cookingTime: '',
    servings: '',
    ingredients: [''],
    instructions: [''],
    image: ''
  });

  // Define categories and their subsections
  const categories = {
    'Starters': {
      name: 'Starters',
      subsections: ['soups', 'kebabs', 'salads']
    },
    'Main Courses': {
      name: 'Main Courses',
      subsections: ['chicken', 'lamb', 'beef', 'mince', 'seafood', 'vegetables']
    },
    'Sides': {
      name: 'Sides',
      subsections: ['rice', 'bread', 'daal']
    },
    'Snacks': {
      name: 'Snacks',
      subsections: []
    },
    'Desserts': {
      name: 'Desserts',
      subsections: []
    },
    'Drinks': {
      name: 'Drinks',
      subsections: []
    },
    'Indo Chinese Fusion': {
      name: 'Indo Chinese Fusion',
      subsections: []
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: value,
      // Reset subcategory when category changes
      ...(name === 'category' ? { subcategory: '' } : {})
    }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeIngredient = (index) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const removeInstruction = (index) => {
    setRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the recipe data to your backend
    console.log('Recipe to be saved:', recipe);
    // For now, we'll just navigate back to home
    navigate('/');
  };

  // Get subsections for the current category
  const currentCategory = categories[recipe.category];
  const hasSubsections = currentCategory && currentCategory.subsections.length > 0;

  return (
    <div className="add-recipe-page">
      <div className="add-recipe-container">
        <h1 className="section-title">Add New Recipe</h1>
        <form onSubmit={handleSubmit} className="add-recipe-form">
          <div className="form-group">
            <label htmlFor="name">Recipe Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={recipe.name}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter recipe name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={recipe.category}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Select a category</option>
              {Object.values(categories).map(category => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {hasSubsections && (
            <div className="form-group">
              <label htmlFor="subcategory">Subcategory</label>
              <select
                id="subcategory"
                name="subcategory"
                value={recipe.subcategory}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="">Select a subcategory</option>
                {currentCategory.subsections.map(subcategory => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={recipe.description}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter recipe description"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="cookingTime">Cooking Time (minutes)</label>
              <input
                type="number"
                id="cookingTime"
                name="cookingTime"
                value={recipe.cookingTime}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., 30"
              />
            </div>

            <div className="form-group half">
              <label htmlFor="servings">Servings</label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={recipe.servings}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., 4"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={recipe.image}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter image URL"
            />
          </div>

          <div className="form-group">
            <label>Ingredients</label>
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="input-group">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  className="form-control"
                  placeholder="Enter an ingredient"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="add-button">
              Add Ingredient
            </button>
          </div>

          <div className="form-group">
            <label>Instructions</label>
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className="input-group">
                <textarea
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  className="form-control"
                  placeholder={`Step ${index + 1}`}
                  rows="2"
                />
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addInstruction} className="add-button">
              Add Instruction
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Save Recipe
            </button>
            <button type="button" onClick={() => navigate('/')} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe; 