# **CookWithAI - Recipe Generator App**

## **Introduction**

**CookWithAI** is a user-friendly, interactive web application that helps users generate customized recipes based on the ingredients they have on hand and the type of dish they want to make. It adds a warm touch by including **motherly advice** throughout the recipe steps, ensuring that cooking is not just functional but also an emotional, nurturing experience. The app also generates a visual representation of the dish through AI-based image generation. 

The app integrates **Google's Gemini API** to generate recipes and uses the **Replicate API** for generating dish images. It also accounts for dietary considerations, allowing users to input restrictions (e.g., vegetarian, vegan, gluten-free), which the AI uses to tailor the recipe.

---

## **Features**

- **Personalized Recipe Generation**: Generate recipes based on the ingredients you input, and choose from common dish types or enter your own custom dish.
- **Dietary Considerations**: The app adjusts the recipe according to dietary preferences, such as vegetarian, vegan, gluten-free, keto, etc.
- **Motherly Advice**: Each recipe step includes warm, nurturing advice, making it feel like you’re being guided by a loving mother.
- **Dish Image Generation**: Using AI, the app generates a realistic image of the dish based on the ingredients and dish type selected.
- **Customizable Input**: You can input your own ingredients and dish names if they aren't listed in the options.

---

## **Table of Contents**

1. [Introduction](#introduction)
2. [Features](#features)
3. [How Prompting Techniques Were Applied](#how-prompting-techniques-were-applied)
4. [Parameters and Fine-Tuning](#parameters-and-fine-tuning)
5. [How to Run the Project](#how-to-run-the-project)
6. [Conclusion](#conclusion)

---

## **3. How Prompting Techniques Were Applied**

To generate high-quality recipes and a personalized cooking experience, we used various **prompting techniques** in conjunction with **Google Gemini** for recipe generation and **Replicate** for image generation. These techniques helped ensure the AI responses were not only accurate but also engaging and warm, in line with the nurturing theme of the app.

### **Few-Shot Prompting**

We used **Few-Shot Prompting** to guide the AI by providing examples of how the recipe should be structured. By giving a clear example of a recipe with step-by-step instructions and motherly advice, the AI was able to follow this format for any dish, ensuring consistency.

**Example**:
```txt
Step 1: Prepare the Chicken
“First, my dear, take your boneless, skinless chicken breasts and cut them into small, bite-sized cubes. Coat them with a little flour, salt, and pepper. Don’t rush it—the flour coating will give it a beautiful crispy texture when we cook it.”
*Motherly Tip:* “Don’t be shy with the flour! A good coating will ensure the chicken gets that perfect crispy crust we all love.”
```

### **Role-Based Prompting**
In Role-Based Prompting, we assigned a specific role to the AI to shape its responses. Here, we asked the AI to adopt the persona of a world-renowned chef who gives motherly advice throughout the recipe, ensuring that the output has a warm, engaging tone.

Example:

```txt
You are a world-renowned chef. Create a detailed recipe for Pasta using pasta, tomato, and chicken. Include step-by-step instructions and motherly advice to make the recipe extra special.
```

### *Chain-of-Thought Prompting*
We used Chain-of-Thought Prompting to request that the AI reason through the recipe creation step-by-step. This technique ensures that each step is logically ordered, easy to follow, and provides clear reasoning for each action in the recipe.

Example:

```txt
Please provide step-by-step instructions for making the dish, including the reasoning behind each step. For example, explain why you coat the chicken with flour and why it’s important to brown it in the pan.
```
### *Contextual Prompting*
Contextual Prompting involves providing the AI with additional context to tailor the recipe generation. This allows us to include dietary restrictions (such as vegetarian or gluten-free) and adjust the recipe accordingly.

Example:


```txt
Generate a recipe for pasta using chicken, tomatoes, and pasta. Include step-by-step instructions and dietary considerations, like gluten-free if applicable.
```
## *4. Parameters and Fine-Tuning*
To fine-tune the output and ensure that the recipe responses are engaging and precise, we adjusted several key parameters:

### *Temperature*
 This parameter controls the creativity of the model. We set it to 0.7, which strikes a balance between creativity and accuracy, ensuring that the recipes are both imaginative and realistic.

Why this setting: A temperature of 0.7 allows for diverse output without deviating too much from the prompt, ensuring that recipes stay relevant and coherent.

Max Tokens: This limits the length of the AI’s response. We set this to 500 to ensure that the recipe instructions are detailed but concise enough to be easily followed by the user.

Why this setting: Limiting the length prevents overly long or verbose responses that might overwhelm the user.

Top-p (Nucleus Sampling): This controls the diversity of the AI’s output. We set top-p = 0.9 to allow the model to explore a wide range of responses while maintaining logical coherence.

Why this setting: The 0.9 setting ensures that the model explores different variations of the recipe while sticking to the essential points.

Frequency Penalty: This reduces the likelihood of the model repeating itself. We set it to 0.2 to ensure that the recipe is fresh and varied, without unnecessary repetitions.

Why this setting: A small penalty allows the model to avoid redundancy while keeping the text fluid.

Presence Penalty: This parameter discourages the model from introducing too many new ideas without context. We set it to 0.3 to ensure that the generated recipe stays focused on the task at hand.

Why this setting: It helps keep the recipe focused and coherent, without straying into irrelevant details.

5. How to Run the Project
Step 1: Clone the Repository
Clone the repository to your local machine:

bash
Copy code
git clone https://github.com/YourUsername/CookWithAI.git
cd CookWithAI
Step 2: Set Up the Backend
Navigate to the backend folder:

bash
Copy code
cd backend
npm install
Create a .env file in the backend folder and add your Google Gemini API Key:

plaintext
Copy code
GEMINI_API_KEY=your_api_key_here
REPLICATE_API_KEY=your_replicate_api_key (if using image generation)
Start the backend server:

bash
Copy code
node server.js
This will start the backend server on http://localhost:5000.

Step 3: Set Up the Frontend
Navigate to the frontend folder:

bash
Copy code
cd frontend
npm install
Start the frontend server:

bash
Copy code
npm run dev
The app will open in your browser at http://localhost:5173.

6. Conclusion
CookWithAI is an interactive recipe generator that not only provides tailored recipes based on ingredients and dietary restrictions but also adds a personal touch with motherly advice. We used advanced prompting techniques to generate personalized, warm, and engaging content. The fine-tuning of parameters like temperature, max tokens, and top-p allowed us to achieve the right balance of creativity, conciseness, and relevance.

The app’s ability to combine recipe generation and image generation (via future integration) provides a truly interactive and personalized cooking experience.
