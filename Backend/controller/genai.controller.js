import { GoogleGenAI } from "@google/genai"

const askGemini = async (req , res) => {
    try {
        const {prompt} = req.body

        const ai = new GoogleGenAI({
            apiKey:process.env.GEMINI_API_KEY
        })

        const intraction = await ai.interactions.create({
            model:"gemini-3.5-flash-lite",
            input: prompt
        })

        // console.log(intraction.output_text)
        res.status(200).json(intraction.output_text)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error" })
    }
}

export {askGemini}