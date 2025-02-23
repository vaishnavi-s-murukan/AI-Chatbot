import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("❌ GEMINI_API_KEY is missing. Set it in environment variables.");
}
// Initialize Gemini API
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// Generation settings
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};
export const configureGemini = () => ({
    model,
    generationConfig, // ✅ Now correctly included
});
export default configureGemini;
//# sourceMappingURL=gemini-config.js.map