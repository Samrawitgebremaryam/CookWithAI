import React, { useState } from 'react';
import './style.css';

const App = () => {
  // State for user input
  const [ingredients, setIngredients] = useState('');
  const [selectedDish, setSelectedDish] = useState('');
  const [customDish, setCustomDish] = useState('');
  const [recipe, setRecipe] = useState('');
  const [image, setImage] = useState('');
  const [motherlyAdvice, setMotherlyAdvice] = useState('');

  const dishes = [
    'Pasta', 'Pizza', 'Cake', 'Bread', 'Soup', 'Dessert', 
    'Pancake', 'Salad', 'Snack', 'Sandwich'
  ];

  // Handle ingredient input change
  const handleIngredientChange = (e) => {
    setIngredients(e.target.value);
  };

  // Handle dish selection change
  const handleDishChange = (e) => {
    setSelectedDish(e.target.value);
  };

  // Handle custom dish input
  const handleCustomDishChange = (e) => {
    setCustomDish(e.target.value);
  };

  // Handle form submission to generate the recipe and image
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Split the ingredients string into an array
    const ingredientsArray = ingredients.split(',').map(item => item.trim());

    const response = await fetch('http://localhost:5000/generate-recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ingredients: ingredientsArray,
        dish: customDish || selectedDish,
      }),
    });

    const data = await response.json();
    setRecipe(data.recipe);
    setMotherlyAdvice("Cooking Tip: 'Add a pinch of love, and don’t forget to taste along the way!'");  // Use backend advice if needed
    setImage(data.imageUrl);
  };

  return (
    <div id="app">
      <h1 className="header-title">Cooking with Your Mom</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <fieldset className="input-field">
          <legend>Enter Ingredients (comma-separated):</legend>
          <input
            type="text"
            value={ingredients}
            onChange={handleIngredientChange}
            placeholder="e.g., Chicken, Tomatoes, Garlic"
            className="input"
          />
        </fieldset>

        <fieldset className="input-field">
          <legend>Select or Enter a Dish Type:</legend>
          <select value={selectedDish} onChange={handleDishChange} className="input">
            <option value="">Select a dish</option>
            {dishes.map((dish) => (
              <option key={dish} value={dish}>{dish}</option>
            ))}
            <option value="Other">Other (Enter your own)</option>
          </select>

          {selectedDish === 'Other' && (
            <div className="input-container">
              <input
                type="text"
                value={customDish}
                onChange={handleCustomDishChange}
                placeholder="Enter your custom dish"
                className="input"
              />
            </div>
          )}
        </fieldset>

        <button type="submit" className="submit-button">Generate Recipe</button>
      </form>

      {/* Display Recipe, Image only after submission */}
      {recipe && (
        <div id="recipeResults" className="recipe-results">
          {/* Motherly Advice */}
          <div className="recipe-section">
            <h3 className="recipe-subtitle">Motherly Advice:</h3>
            <p className="motherly-advice">{motherlyAdvice}</p>
          </div>

          {/* Recipe Title */}
          <h2 className="recipe-title">{selectedDish || customDish}</h2>

          {/* Ingredients List */}
          <div className="recipe-section">
            <h3 className="recipe-subtitle">Ingredients:</h3>
            <ul className="recipe-list">
              {ingredients.split(',').map((ingredient, index) => (
                <li key={index} className="recipe-item">{ingredient.trim()}</li>
              ))}
            </ul>
          </div>

          {/* Cooking Instructions */}
          <div className="recipe-section">
            <h3 className="recipe-subtitle">Cooking Instructions:</h3>
            <div className="recipe-instructions">
              <p>{recipe}</p>
            </div>
          </div>

          {/* Dish Image */}
          {image && (
            <div className="recipe-section">
              <h3 className="recipe-subtitle">Dish Image:</h3>
              <img src={image} alt="Generated Dish" className="dish-image" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
