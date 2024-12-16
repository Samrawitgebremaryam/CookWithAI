const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Initialize Google Generative AI with the API Key from .env file
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Route for testing server functionality
app.get('/', (req, res) => {
  res.send('Recipe Generator API is running!');
});

// Route for generating recipe based on ingredients and dish type
app.post('/generate-recipe', async (req, res) => {
  const { ingredients, dish, dietaryRestrictions, servings, time } = req.body;

  if (!ingredients || ingredients.length === 0 || !dish) {
    return res.status(400).send({ message: 'Ingredients and dish are required for generating the recipe.' });
  }

  // Build a detailed prompt with examples and more context
  const express = require('express');
  const axios = require('axios');
  const cors = require('cors');
  require('dotenv').config();
  
  const app = express();
  const PORT = process.env.PORT || 5000;
  
  app.use(express.json());
  app.use(cors());
  
  // Initialize Google Generative AI with the API Key from .env file
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  // Route for testing server functionality
  app.get('/', (req, res) => {
    res.send('Recipe Generator API is running!');
  });
  
  // Route for generating recipe based on ingredients and dish type
  app.post('/generate-recipe', async (req, res) => {
    const { ingredients, dish, dietaryRestrictions, servings, time } = req.body;
  
    if (!ingredients || ingredients.length === 0 || !dish) {
      return res.status(400).send({ message: 'Ingredients and dish are required for generating the recipe.' });
    }
  
    // Build a detailed prompt with examples and more context
    let prompt = `You are a world-renowned chef. Create a detailed recipe for ${dish} using ${ingredients.join(', ')}. 
    Include the following in the recipe:
  
    - Serving size: ${servings || '4 servings'}
    - Estimated cooking time: ${time || '30 minutes'}
    - Dietary considerations: ${dietaryRestrictions || 'None'}
    
    The recipe should be formatted as follows:
    
    **Ingredients:**
    - 2 boneless chicken breasts
    - 1 cup flour
    - 2 teaspoons salt
    - 1 teaspoon pepper
  
    **Instructions:**
    
    Step 1: Prepare the Chicken  
    "First, take your boneless, skinless chicken breasts and cut them into small, bite-sized cubes. Ensure the pieces are about the same size for even cooking. Now, coat them with a little flour, salt, and pepper. Don’t rush it—the flour coating will give it a beautiful crispy texture when we cook it.”  
    Motherly Tip: "Make sure the flour coating is even, this will help the chicken get that lovely crisp."
  
    Repeat for all the steps in the recipe.`;
  
    if (dietaryRestrictions) {
      prompt += ` Ensure the recipe adheres to a ${dietaryRestrictions} diet.`;
    }
  
    try {
      // Generate the recipe using Google Generative AI
      const result = await model.generateContent(prompt, {
        temperature: 0.7,
        maxTokens: 500,
        topP: 0.9,
        frequencyPenalty: 0.2,
        presencePenalty: 0.3,
      });
  
      // Log the full response to inspect the structure
      console.log("Full Generated Result:", JSON.stringify(result, null, 2));
  
      // Extract the recipe text from the correct path
      if (result && result.response && result.response.candidates && result.response.candidates[0]) {
        const recipeText = result.response.candidates[0].content.parts[0].text || "No text content found in candidates[0].";
        console.log("Recipe Text:", recipeText);
  
        // Send back the response with the recipe and image URL
        res.json({ recipe: recipeText, imageUrl: "https://example.com/default_image.jpg" });
      } else {
        res.status(500).send({ message: 'Error: No valid recipe text found in the response structure.' });
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      res.status(500).send({ message: 'Error generating recipe. Please try again later.' });
    }
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  

  if (dietaryRestrictions) {
    prompt += ` Ensure the recipe adheres to a ${dietaryRestrictions} diet.`;
  }

  try {
    // Generate the recipe using Google Generative AI
    const result = await model.generateContent(prompt, {
      temperature: 0.7,
      maxTokens: 500,
      topP: 0.9,
      frequencyPenalty: 0.2,
      presencePenalty: 0.3,
    });

    // Log the full response to inspect the structure
    console.log("Full Generated Result:", JSON.stringify(result, null, 2));

    // Extract the recipe text from the correct path
    if (result && result.response && result.response.candidates && result.response.candidates[0]) {
      const recipeText = result.response.candidates[0].content.parts[0].text || "No text content found in candidates[0].";
      console.log("Recipe Text:", recipeText);

      // Send back the response with the recipe and image URL
      res.json({ recipe: recipeText, imageUrl: "https://example.com/default_image.jpg" });
    } else {
      res.status(500).send({ message: 'Error: No valid recipe text found in the response structure.' });
    }
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).send({ message: 'Error generating recipe. Please try again later.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
