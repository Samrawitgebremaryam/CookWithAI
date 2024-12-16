import React, { useState } from 'react';
import './style.css';

const App = () => {
  const [ingredients, setIngredients] = useState('');
  const [selectedDish, setSelectedDish] = useState('');
  const [customDish, setCustomDish] = useState('');
  const [selectedDietary, setSelectedDietary] = useState('None');
  const [recipe, setRecipe] = useState('');
  const [image, setImage] = useState('');
  const [motherlyAdvice, setMotherlyAdvice] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const dishes = [
    'Pasta', 'Pizza', 'Cake', 'Bread', 'Soup', 'Dessert',
    'Pancake', 'Salad', 'Snack', 'Sandwich'
  ];

  const dietaryOptions = [
    'None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Dairy-Free'
  ];

  // Handle input changes
  const handleIngredientChange = (e) => setIngredients(e.target.value);
  const handleDishChange = (e) => setSelectedDish(e.target.value);
  const handleCustomDishChange = (e) => setCustomDish(e.target.value);
  const handleDietaryChange = (e) => setSelectedDietary(e.target.value);

  // Handle form submission to generate the recipe and image
  const handleSubmit = async (e) => {
    e.preventDefault();

    const ingredientsArray = ingredients.split(',').map(item => item.trim());

    const response = await fetch('http://localhost:5000/generate-recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ingredients: ingredientsArray,
        dish: customDish || selectedDish,
        dietaryRestrictions: selectedDietary,
      }),
    });

    const data = await response.json();
    setRecipe(data.recipe);
    setImage(data.imageUrl);
    setMotherlyAdvice("Cooking Tip: 'Add a pinch of love, and don’t forget to taste along the way!'");
    setSuccessMessage('Recipe successfully generated!');

    // Scroll to the recipe results section after generation
    setTimeout(() => {
      document.getElementById('recipeResults').scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  return (
    <div id="app">
      <h1 className="header-title">Cooking Companion</h1>
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

        <fieldset className="input-field">
          <legend>Select Dietary Considerations:</legend>
          <select value={selectedDietary} onChange={handleDietaryChange} className="input">
            {dietaryOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </fieldset>

        <button type="submit" className="submit-button">Generate Recipe</button>
      </form>

      {/* Success Message */}
      {successMessage && <div className="success-message"><p>{successMessage}</p></div>}

      {/* Display Recipe and Image */}
      {recipe && (
        <div id="recipeResults" className="recipe-results">
          <div className="recipe-section">
            <h3 className="recipe-subtitle">Motherly Advice:</h3>
            <p className="motherly-advice">{motherlyAdvice}</p>
          </div>

          <h2 className="recipe-title">{selectedDish || customDish}</h2>

          <div className="recipe-section">
            <h3 className="recipe-subtitle">Ingredients:</h3>
            <ul className="recipe-list">
              {ingredients.split(',').map((ingredient, index) => (
                <li key={index} className="recipe-item">{ingredient.trim()}</li>
              ))}
            </ul>
          </div>

          <div className="recipe-section">
            <h3 className="recipe-subtitle">Cooking Instructions:</h3>
            <div className="recipe-instructions">
              {/* Render the recipe as HTML */}
              <p dangerouslySetInnerHTML={{ __html: recipe }}></p>
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
