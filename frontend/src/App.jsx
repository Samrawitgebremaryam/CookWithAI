import React, { useState } from 'react';
import './style.css';

const App = () => {
  const [ingredient, setIngredient] = useState('');
  const [dish, setDish] = useState('');
  const [diet, setDiet] = useState('');
  const [recipe, setRecipe] = useState('');
  const [advice, setAdvice] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/generate-recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredient, dish, diet }),
    });

    const data = await response.json();
    setRecipe(data.recipe);
    setAdvice(data.advice);
    setImage(data.imageUrl);
  };

  return (
    <div id="app">
      <h1>Cooking with Your Mom</h1>
      <form onSubmit={handleSubmit}>
        <label>Main Ingredient:</label>
        <input
          type="text"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          placeholder="e.g., chicken, tomatoes"
        />
        <label>Dish Type:</label>
        <input
          type="text"
          value={dish}
          onChange={(e) => setDish(e.target.value)}
          placeholder="e.g., stir-fry, pasta"
        />
        <label>Dietary Restrictions:</label>
        <input
          type="text"
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          placeholder="e.g., gluten-free, vegetarian"
        />
        <button type="submit">Generate Recipe</button>
      </form>

      <div id="recipeResults">
        <h2>Generated Recipe:</h2>
        <p>{recipe}</p>

        <h3>Motherly Advice:</h3>
        <p>{advice}</p>

        <h3>Dish Image:</h3>
        <img src={image} alt="Generated Dish" />
      </div>
    </div>
  );
};

export default App;
