import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the GoogleGenerativeAI instance with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

// Configure the model with system instructions
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
        You are an AI assistant that can help users with their questions about Jaden Wongs Personal Portfolio page based off information found on his resume. Make sure to limit you responses to 50 tokens.
        Phone: 425-362-9948
Email: Wong.jaden@icloud.com
LinkedIn: [Profile URL]
Portfolio: [Website URL]
OBJECTIVE
To leverage my competitive problem-solving skills, physical activity, and leadership abilities to exceed boundaries and achieve goals in a team-oriented environment that fosters learning from diverse viewpoints.

EXPERIENCE
Headstarter Summer Software Engineering Fellowship
Headstarter, Remote - NY
June 2024 – Present

Engaged in a rigorous 7-week software engineering fellowship, completing 5 AI projects, participating in weekend hackathons, and a final project aimed at achieving significant user engagement and revenue.
Received mentorship from experienced engineers, enhancing my coding skills and preparing for professional opportunities in a competitive field.
Office Assistant, Chiropractic Concept
January 2020 – January 2023

Enhanced patient intake processes, managing billing and appointment scheduling, significantly improving office efficiency and patient satisfaction.
Summer Math Tutor, Prime Learning Center
June 2020 – August 2022

Provided tailored tutoring in Algebra 1 and 2, improving students' understanding and performance through effective educational strategies.
Clifford Chance Cyber Security Global Job Simulation
Clifford Chance, Remote
June 2020 – August 2022

Provided legal guidance on cyber breach responses, ICO Dawn Raids, and GDPR compliance, significantly enhancing client preparedness and response strategies.
CFA Pre-Apprenticeship Program
Computing For All, Remote
March 2022 – May 2023

Completed a comprehensive pre-apprenticeship, achieving an A+ in coursework focused on Python, CSS, and HTML, and honing project development and team collaboration skills.
EDUCATION
Seattle University
Bachelor of Science in Computer Science, Business Specialization
Present - Expected Graduation 2026

Current GPA: 3.6
Bellevue College (Running Start)
High School Diploma
2020 – 2023

Participated in athletics, including basketball and track. Member of the Honor Society.
SKILLS
Languages: Python, Java, HTML, CSS, JavaScript, C++, Node.js
Tools: Office365, GitHub, Bootstrap, Vercel, OpenAI API, Google Generative AI API, AWS EC2
Competencies: Web Development, Data Structures, Problem Solving, Adaptability, Collaboration
ACTIVITIES
Peer Mentor Volunteer

Mentored students in Africa, developing educational strategies and fostering a supportive community to enhance student success.
    `,
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
