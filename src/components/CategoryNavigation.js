import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CategoryNavigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});

  const mainCategories = [
    {
      name: 'Starters',
      image: '/images/starter.png',
      link: '/category/starters'
    },
    {
      name: 'Main Courses',
      image: '/images/main-courses.png',
      link: '/category/main-courses'
    },
    {
      name: 'Sides',
      image: '/images/sides.png',
      link: '/category/sides'
    },
    {
      name: 'Snacks',
      image: '/images/snacks.png',
      link: '/category/snacks'
    },
    {
      name: 'Desserts',
      image: '/images/desserts.png',
      link: '/category/desserts'
    },
    {
      name: 'Drinks',
      image: '/images/drinks.png',
      link: '/category/drinks'
    },
    {
      name: 'Indo Chinese Fusion',
      image: '/images/indo-chinese-fusion.png',
      link: '/category/indo-chinese-fusion'
    }
  ];

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = mainCategories.map((category) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => ({
              ...prev,
              [category.name]: true
            }));
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to load image for ${category.name}`);
            setLoadedImages(prev => ({
              ...prev,
              [category.name]: false
            }));
            resolve();
          };
          img.src = category.image;
        });
      });

      await Promise.all(imagePromises);
      setIsLoading(false);
    };

    loadImages();
  }, []);

  const handleImageError = (e, categoryName) => {
    e.target.src = `https://via.placeholder.com/160x160?text=${categoryName}`;
  };

  if (isLoading) {
    return <div className="loading">Loading categories...</div>;
  }

  return (
    <section className="categories-section">
      <div className="categories-title">
        <h2>Categories</h2>
      </div>
      <div className="categories-grid">
        {mainCategories.map((category) => (
          <Link 
            key={category.name}
            to={category.link}
            className="category-item"
          >
            <div className="category-image-container">
              <img 
                src={category.image}
                alt={category.name}
                className="category-image"
                onError={(e) => handleImageError(e, category.name)}
              />
            </div>
            <span className="category-name">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryNavigation; 