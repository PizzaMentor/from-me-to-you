import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import RecipeDetail from '../components/RecipeDetail';

const categories = {
  'starters': {
    name: 'Starters',
    description: "In my day-to-day routine, I do not make starters. They are saved for parties or special occasions. They work well for parties because as soon as the guests arrive, I can serve them starters while we wait for everyone to come (and then serve the main course). Most of my starters are bite-sized, light, and healthy. They're served at the table—generally not a sharing thing that's eaten on the couch. Very often, I find that if the starter is based on what is normally a main dish, I adjust the size.",
    subcategories: ['soups', 'kebabs', 'salads'],
    subcategoryDescriptions: {
      'soups': "The key to good soup is making your own stock, which forms the base for all your soups. Ready-made stock cubes or granules often contain large quantities of salt, flavourings, and preservatives, which may not be good for your health. In addition, they do not produce the exciting flavours of fresh herbs, meat, fish, and shellfish skillfully blended. Soups can be divided into three main groups or classes: 1.Thin, clear soups – such as consommé or a well-seasoned bouillon and clear broth, often garnished with thin strips of vegetables (julienne). These soups are typically made with a light meat stock, but there are also clear vegetable soups and herbal consommés. 2. Thin, light, delicate cream soups – such as cream of asparagus, celery, or tomato soup. These include light bisques to which cream is usually added, but they are not thickened with a butter and flour roux. They are often enriched with an egg and cream liaison. 3. Thick soups – hearty soups that are often a meal in themselves. These are made with vegetables, chunks of meat or fish, and may include rice, pasta, and more.",
      'kebabs': "These are my husband's favourite—kebabs. Not just kebabs, actually—all grilled food. The term kebab has evolved over time. During the era of Genghis Khan, horseback riders would kill an animal, clean it, cut it into pieces, thread the pieces onto daggers or swords, and cook them over an open fire. That was the first kebab: a piece of meat threaded on a dagger and cooked over an open flame. Since then, kebabs have evolved—from whole muscle meats to minced meats, and even non-meat versions. Sometimes, they're even sweet!.",
      'salads': "To me, salads are composed of all kinds of delicate meats, fish, shellfish, eggs, nuts, fruit, cheese, and vegetables—cooked or uncooked. Two things are indispensable to every kind and grade of salad: the foundation of vegetables and the dressing. Leftovers — all may be transformed, with a bit of artistic treatment, into salads that are delectable to both the eye and the taste."
    }
  },
  'main-courses': {
    name: 'Main Courses',
    description: "Whenever I plan a meal for my family or guests, the first thing I decide is the main course. Then I build the whole meal around it. It's always the hero of my story—the main protagonist. My favourite ingredient is lamb (or goat), but the one I use most often is chicken. Even though my kids don't like vegetables, I've spent a lot of time making them fun and different—because of their health benefits. One thing you can't tell anyone: I don't like vegetables either.  But someone has to set an example... sigh",
    subcategories: ['chicken', 'lamb', 'beef', 'mince', 'seafood', 'vegetables']
  },
  'sides': {
    name: 'Sides',
    description: " Typically, I make Indian food—so a side dish is a must. For me, that's rice, bread, daal, etc. Even though it's only a side dish, not making one isn't usually a big problem. However, I've found that side dishes often enhance the main dish more than you'd expect. And if you have picky guests, side dishes can be a total lifesaver.",
    subcategories: ['rice', 'bread', 'daal']
  },
  'snacks': {
    name: 'Snacks',
    description: "Snacks are a staple in my kitchen, especially when unexpected guests drop by. They're quick, easy, and my family usually makes them disappear faster than I can prepare them! Snacks are my go-to for bridging the gap between meals or cheering someone up with a little crunch.",
    subcategories: []
  },
  'desserts': {
    name: 'Desserts',
    description: "Even though I'm not a fan of desserts, my husband lives for sweets! All my guests also seem to enjoy the desserts I make—whether they're Indian or continental. That doesn't mean I don't like preparing dessert. I just don't like eating it. In my opinion, dessert ruins the lovely flavours from the earlier courses… Except if the dessert is caramel custard—then I take it all back.",
    subcategories: []
  },
  'drinks': {
    name: 'Drinks',
    description: "Drinks in my home are more than just thirst-quenchers—they're part of the welcome. I love creating drinks that comfort and surprise. It's amazing how one sip can set the tone for an entire meal. It's also a smart way to stay hydrated without being boring. But remember, people—water is still king!",
    subcategories: []
  },
  'indo-chinese-fusion': {
    name: 'Indo Chinese Fusion',
    description: "Indo-Chinese food is where my creativity gets to play. It's bold, saucy, spicy, and always a hit—especially with kids (mine included!). These dishes bring street food vibes straight to the table. I love how they blend Indian soul with Chinese technique—it's fusion that truly feels like home.",
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
            setRecipes(data.recipes.map(recipe => ({
              ...recipe,
              imageUrl: recipe.image || recipe.imageUrl
            })));
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
              allRecipes.push(...data.recipes.map(recipe => ({
                ...recipe,
                imageUrl: recipe.image || recipe.imageUrl
              })));
            } catch (err) {
              console.warn(`Could not load recipes for ${subcategory}:`, err);
            }
          }
          setRecipes(allRecipes);
        } else {
          // Load recipes from specific subcategory
          const response = await fetch(`/data/${normalizedCategoryId}/${selectedSubcategory}/recipes.json`);
          const data = await response.json();
          setRecipes(data.recipes.map(recipe => ({
            ...recipe,
            imageUrl: recipe.image || recipe.imageUrl
          })));
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
      
      <div className="category-description">
        <p>{category.description}</p>
      </div>
      
      {category.subcategories.length > 0 && (
        <>
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

          {selectedSubcategory && category.subcategoryDescriptions && category.subcategoryDescriptions[selectedSubcategory] && (
            <div className="subcategory-description">
              <p>{category.subcategoryDescriptions[selectedSubcategory]}</p>
            </div>
          )}
        </>
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