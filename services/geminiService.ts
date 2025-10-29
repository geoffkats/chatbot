import { GoogleGenAI, Chat } from "@google/genai";
import type { FAQ } from '../types';

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;
let currentFaqString: string | null = null;
let currentLanguage: string | null = null;


const getAI = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

const getChat = (faqs: FAQ[], language: string) => {
    const aiInstance = getAI();
    const faqString = faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');

    const systemInstruction = `You are an expert AI WhatsApp receptionist for a company called 'Zentara'. Your primary goals are to be friendly, helpful, answer customer questions based on the provided knowledge base, capture lead information, and escalate to a human when necessary.

    **Your Persona & Rules:**
    1.  **Language:** You MUST respond exclusively in the following language: ${language}. All your responses must be in ${language}.
    2.  **Be Sophisticated & Professional:** Your tone should be confident, elegant, and professional, yet friendly and approachable. Start with a warm greeting. Avoid slang. Use emojis very sparingly to maintain a premium feel.
    3.  **Use the Knowledge Base:** ONLY answer questions based on the following FAQs. If a question is outside this scope, politely state that you don't have the information and ask if you can help with anything else. Do not make up answers.
    4.  **Lead Capture Goal:** Proactively try to collect the user's name, email, phone number, and which service they are interested in.
    5.  **LEAD_CAPTURE_FORMAT:** When you have successfully gathered a user's name, email, phone number, and their service of interest, you MUST respond ONLY with a single line in the following strict JSON format. Do not add any conversational text before or after it:
        \`LEAD::{"name":"<user_name>","email":"<user_email>","phone":"<user_phone>","interest":"<service_of_interest>"}\`
    6.  **Multi-turn Conversation:** Remember the context of the conversation. If a user asks a follow-up question, answer it naturally based on previous messages.
    7.  **Keep it Concise:** Provide clear and brief answers, like a real chat assistant. Use short paragraphs.
    8.  **Escalation:** If a user expresses significant frustration, has a complex technical issue, or asks a question you cannot answer with the knowledge base twice, you MUST escalate. Respond ONLY with this exact message: "I'm transferring you to a human agent for assistance. Please wait a moment."

    **Knowledge Base (FAQs):**
    ---
    ${faqString}
    ---
    `;

    if (!chat || currentFaqString !== faqString || currentLanguage !== language) {
        currentFaqString = faqString;
        currentLanguage = language;
        chat = aiInstance.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });
    }
    
    return chat;
};


export const getBotResponse = async (userMessage: string, faqs: FAQ[], language: string): Promise<string> => {
    try {
        const chatSession = getChat(faqs, language);
        const response = await chatSession.sendMessage({ message: userMessage });
        return response.text.trim();
    } catch (error) {
        console.error("Gemini API error:", error);
        chat = null;
        currentFaqString = null;
        currentLanguage = null;
        return "I'm sorry, but I've encountered an error. Please try asking your question again.";
    }
};

export const translateText = async (text: string, targetLanguage: string, sourceLanguage?: string): Promise<string> => {
    try {
        const aiInstance = getAI();
        const sourceLangInstruction = sourceLanguage ? `from ${sourceLanguage} ` : '';
        const prompt = `Translate the following text ${sourceLangInstruction}to ${targetLanguage}. Respond with only the translated text, nothing else.\n\nText: "${text}"`;
        
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error('Translation API error:', error);
        return text;
    }
};

export const detectLanguage = async (text: string): Promise<string> => {
    try {
        const aiInstance = getAI();
        const prompt = `Detect the language of the following text and respond with only the two-letter ISO 639-1 code (e.g., 'en', 'es', 'fr', 'de'). If you are unsure, default to 'en'.\n\nText: "${text}"`;

        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const langCode = response.text.trim().toLowerCase().slice(0, 2);
        if (['en', 'es', 'fr', 'de'].includes(langCode)) {
            return langCode;
        }
        return 'en'; 
    } catch (error) {
        console.error('Language detection API error:', error);
        return 'en';
    }
};