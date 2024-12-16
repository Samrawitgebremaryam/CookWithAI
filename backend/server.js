const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();  // To load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to handle CORS and JSON parsing
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

// Enhanced Route for generating recipe based on ingredients and dish type
app.post('/generate-recipe', async (req, res) => {
  const { ingredients, dish, dietaryRestrictions, servings, time } = req.body;

  // Validate input
  if (!ingredients || ingredients.length === 0 || !dish) {
    return res.status(400).send({ message: 'Ingredients and dish are required for generating the recipe.' });
  }

  // Build a detailed prompt with examples and more context
  let prompt = `You are a world-renowned chef. Create a detailed recipe for ${dish} using ${ingredients.join(', ')}. 
  Include the following in the recipe:

  - Serving size: ${servings || '4 servings'}
  - Estimated cooking time: ${time || '30 minutes'}
  - Dietary considerations: ${dietaryRestrictions || 'None'}
  
  Format the recipe as follows:
  - Provide clear and detailed step-by-step instructions, like a mom teaching her child.
  - Each step should be numbered.
  - After each step, provide a “Motherly Tip” in italics.
  - Make sure the recipe feels like a warm, loving experience.

  Example format:

  Step 1: Prepare the Chicken  
  “First, my dear, take your boneless, skinless chicken breasts and cut them into small, bite-sized cubes. Ensure the pieces are about the same size for even cooking. Now, coat them with a little flour, salt, and pepper. Don't rush it—the flour coating will give it a beautiful crispy texture when we cook it.”  
  *Motherly Tip:* “Don’t be shy with the flour! A good coating will ensure the chicken gets that perfect crispy crust we all love.”

  Repeat this for each step in the recipe, using the ingredients provided.

  The recipe should be formatted as HTML to make it easy for the front-end to display.”`;

  // Add extra context or style depending on the dish
  if (dietaryRestrictions) {
    prompt += ` Ensure the recipe adheres to a ${dietaryRestrictions} diet.`;
  }

  try {
    // Generate the recipe using Google Generative AI
    const result = await model.generateContent(prompt, {
      temperature: 0.7, // Controls creativity
      maxTokens: 500, // Allow for a longer recipe with detailed instructions
      topP: 0.9, // Nucleus sampling for diversity
      frequencyPenalty: 0.2, // Avoid repetition of words
      presencePenalty: 0.3, // Avoid repeated ideas
    });

    const recipe = result.response.text();

    // Generate the image for the dish using a service like Replicate
    const imageUrl = await generateImage(dish, ingredients);

    // Respond with the generated recipe and image
    res.json({ recipe, imageUrl });
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).send({ message: 'Error generating recipe. Please try again later.' });
  }
});

// Function to generate image using Replicate (Stable Diffusion)
async function generateImage(dish, ingredients) {
  const apiKey = process.env.REPLICATE_API_KEY;  // Get your Replicate API key from .env
  const url = 'https://api.replicate.com/v1/predictions';

  const prompt = `A high-quality image of a delicious ${dish} made with fresh ingredients like ${ingredients.join(', ')}. Beautifully plated and appetizing.`;

  try {
    const response = await axios.post(url, {
      version: 'stable-diffusion-v1',  // Use the appropriate model version
      input: { prompt: prompt, num_outputs: 1 },
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    // Returning the image URL from the response
    const imageUrl = response.data.output[0].url;
    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    return 'https://example.com/default_image.jpg';  // Placeholder image
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
