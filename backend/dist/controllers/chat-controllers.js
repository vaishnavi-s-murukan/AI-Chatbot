import User from "../models/User.js";
import { configureGemini } from "../config/gemini-config.js";
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered or Token malfunctioned" });
        }
        // Limit chat history (last 20 messages)
        const chatHistoryLimit = 20;
        const chats = user.chats.slice(-chatHistoryLimit).map(({ role, content }) => ({ role, content }));
        // Add new user message
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        // Configure Gemini API
        const { model, generationConfig } = configureGemini();
        // ✅ Corrected API call format
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: message }], // ✅ Fixed format
                },
            ],
            generationConfig,
        });
        // Validate response
        if (!result?.response?.candidates?.length) {
            return res.status(500).json({ message: "Invalid response from AI" });
        }
        // Extract AI message
        const aiMessage = {
            role: "assistant",
            content: result.response.candidates[0].content.parts[0].text,
        };
        // Store AI response
        user.chats.push(aiMessage);
        await user.save();
        return res.status(200).json({ chats: user.chats.slice(-chatHistoryLimit) });
    }
    catch (error) {
        console.error("Error in chat generation:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
export const sendChatsToUser = async (req, res, next) => {
    try {
        //user login
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered or Token Malfunctioned");
        }
        console.log(user._id.toString(), res.locals.jwtData.id);
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map