const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// API route for recipe generation
app.post('/generate-recipe', async (req, res) => {
  const { ingredient, dish, diet } = req.body;

  // Validate input
  if (!ingredient || !dish) {
    return res.status(400).send({ message: 'Ingredient and dish are required.' });
  }

  let prompt = `Generate a recipe for ${dish} using ${ingredient}.`;

  if (diet) {
    prompt += ` The recipe should be suitable for a ${diet} diet.`;
  }

  try {
    const response = await axios.post('YOUR_GEMINI_API_URL', {
      prompt: prompt,
    });

    const recipe = response.data.recipe;
    const advice = response.data.motherlyAdvice;

    // Optionally, generate an image for the dish
    const imageUrl = await generateImage(ingredient, dish);

    res.json({ recipe, advice, imageUrl });
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).send({ message: 'Error generating recipe. Please try again later.' });
  }
});

// Image generation logic (replace with actual API call)
async function generateImage(ingredient, dish) {
  return `https://example.com/generated_image/${ingredient}_${dish}.jpg`;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
