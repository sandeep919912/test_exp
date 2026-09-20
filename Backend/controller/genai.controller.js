import { GoogleGenAI } from "@google/genai";

const askGemini = async (req, res) => {
  try {
    const { prompt } = req.body;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const intraction = await ai.interactions.create({
      model: "gemini-3.5-flash-lite",
      input: prompt,
    });
    
    res.status(200).json(intraction.output_text);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

const suggestCategory = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const instruction = `
You are an expense category classifier.

Choose exactly ONE category from this list:

Food
Travel
Entertainment
Shopping
Others

Expense description:
"${prompt}"

Return ONLY the category name.
Do not return any explanation.
`;

    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash-lite",
      input: instruction,
    });

    const category = interaction.output_text.trim();

    const allowedCategories = [
      "Food",
      "Travel",
      "Entertainment",
      "Shopping",
      "Others",
    ];

    const finalCategory = allowedCategories.includes(category)
      ? category
      : "Others";

    res.status(200).json({
      category: finalCategory,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { askGemini, suggestCategory };
