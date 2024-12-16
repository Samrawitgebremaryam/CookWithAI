const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
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

  The recipe should be formatted as HTML to make it easy for the front-end to display.`;


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

    // Log the full response to inspect the structure (optional, for debugging)
    console.log("Full Generated Result:", JSON.stringify(result, null, 2));

    // Check and extract the recipe text from the response structure
    if (result && result.response && result.response.candidates && result.response.candidates[0]) {
      const recipeText = result.response.candidates[0].content.parts[0].text || "No recipe text found.";
      console.log("Recipe Text:", recipeText);

      // Initialize imageUrl variable to a default message
      let imageUrl = 'https://example.com/default_image.jpg'; 
      let imageGenerationMessage = 'Image generation failed.';

      try {
        // Generate an image based on the dish and ingredients using Hugging Face API
        const imagePrompt = `Generate an image of a dish called "${dish}" made with the following ingredients: ${ingredients.join(', ')}. The image should visually represent this dish with all the ingredients included in a beautiful and appetizing presentation.`;

        // Call Hugging Face API for image generation
        const imageResponse = await axios.post(
          'https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4', // Replace with the correct model endpoint
          {
            inputs: imagePrompt, // Image prompt with dish and ingredients
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            },
          }
        );

        // Get the generated image URL from the response (adjust based on the actual service's response structure)
        imageUrl = imageResponse.data?.generated_image_url || 'https://example.com/default_image.jpg';
        imageGenerationMessage = 'Image generated successfully.';
      } catch (imageError) {
        console.error('Error generating image:', imageError);
        // If image generation fails, continue with the default image message
        imageGenerationMessage = 'Image generation failed.';
      }

      // Send back the response with the recipe and generated image URL (if available)
      res.json({
        recipe: recipeText,
        imageUrl: imageUrl,
        imageGenerationMessage: imageGenerationMessage, // Include message regarding image generation status
      });

    } else {
      res.status(500).send({ message: 'Error: No valid recipe text found in the response structure.' });
    }
  } catch (error) {
    console.error('Error generating recipe or image:', error);
    res.status(500).send({ message: 'Error generating recipe or image. Please try again later.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
