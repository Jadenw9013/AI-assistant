import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the GoogleGenerativeAI instance with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

// Configure the model with system instructions
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are a chatbot for the startup software tech company Headstarter. Use a friendly, supportive, and encouraging tone. Ensure explanations are clear and easy to understand.",
});

// Function to start a chat session with the given history
async function startChat(history) {
    return model.startChat({
        history,
        generationConfig: {
            maxOutputTokens: 50,
        },
    });
}

// Handle POST requests
export async function POST(req) {
    try {
        const history = await req.json();
        const userMsg = history[history.length - 1].parts[0].text; // Extract the user's message

        // Start a chat session and send the user's message
        const chat = await startChat(history);
        const result = await chat.sendMessage(userMsg);

        // Extract the response text from the model
        const output = await result.response.text();

        // Return the model's response as JSON
        return NextResponse.json({ text: output });

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ text: "An error occurred. Please try again later." });
    }
}
