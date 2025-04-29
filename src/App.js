import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CategoryNavigation from './components/CategoryNavigation';
import CategoryView from './pages/CategoryView';
import Home from './pages/Home';
import About from './pages/About';
import AddRecipe from './pages/AddRecipe';
import RecipeDetail from './components/RecipeDetail';
import SearchResults from './pages/SearchResults';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <CategoryNavigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<CategoryView />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/about" element={<About />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/recipe/:recipeId" element={<RecipeDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
