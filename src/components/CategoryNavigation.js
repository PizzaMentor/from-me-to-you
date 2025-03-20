import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CategoryNavigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});

  const mainCategories = [
    {
      name: 'Starters',
      image: 'https://source.unsplash.com/featured/?appetizers',
      link: '/category/starters'
    },
    {
      name: 'Main Courses',
      image: 'https://source.unsplash.com/featured/?main-course',
      link: '/category/main-courses'
    },
    {
      name: 'Sides',
      image: 'https://source.unsplash.com/featured/?side-dishes',
      link: '/category/sides'
    },
    {
      name: 'Desserts',
      image: 'https://source.unsplash.com/featured/?desserts',
      link: '/category/desserts'
    },
    {
      name: 'Drinks',
      image: 'https://source.unsplash.com/featured/?beverages',
      link: '/category/drinks'
    },
    {
      name: 'Indo Chinese Fusion',
      image: 'https://source.unsplash.com/featured/?indo-chinese-food',
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