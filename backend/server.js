const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();  // To load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to handle CORS and JSON parsing
app.use(express.json());
app.use(cors());

// Route for testing server functionality
app.get('/', (req, res) => {
  res.send('Recipe Generator API is running!');
});

// Route for generating recipe based on ingredients and dish type
app.post('/generate-recipe', async (req, res) => {
  const { ingredients, dish } = req.body;

  // Validate input
  if (!ingredients || ingredients.length === 0 || !dish) {
    return res.status(400).send({ message: 'Ingredients and dish are required for generating the recipe.' });
  }

  // Construct the prompt dynamically based on user input for recipe
  let prompt = `Generate a recipe for ${dish} using ${ingredients.join(', ')}.`;
  prompt += ` Include step-by-step instructions and motherly advice to make the recipe extra special.`;

  try {
    // Generate the recipe using OpenAI
    const recipeResponse = await generateRecipe(prompt);

    const recipe = recipeResponse.data;

    // Generate image for the dish using DALL·E
    const imageUrl = await generateImageWithDALL_E(dish);

    // Respond with the generated recipe and image URL
    res.json({ recipe, imageUrl });
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).send({ message: 'Error generating recipe. Please try again later.' });
  }
});

// Function to generate recipe (using OpenAI or similar service)
async function generateRecipe(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/completions'; // Adjust endpoint if using GPT-4 or other models

  try {
    const response = await axios.post(url, {
      model: "gpt-3.5-turbo",  // Use the GPT model (can also use GPT-4 for better results)
      prompt: prompt,
      max_tokens: 400,  // Control the output length
      temperature: 0.7,  // Creativity in the output
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data.choices[0].text;  // Extracting recipe text from response
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw new Error('Failed to generate recipe.');
  }
}

// Function to generate image using DALL·E
async function generateImageWithDALL_E(dish) {
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/images/generations';
  const prompt = `A high-quality image of a delicious ${dish} made with fresh ingredients, beautifully plated.`;

  try {
    const response = await axios.post(url, {
      prompt: prompt,
      n: 1,  // Only one image
      size: "1024x1024",  // Image size
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data.data[0].url;  // Returning image URL from response
  } catch (error) {
    console.error('Error generating image:', error);
    return 'https://example.com/default_image.jpg';  // Return a placeholder image in case of failure
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
