import { GoogleGenAI } from "@google/genai";

// Validate API key is present
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. Chat functionality will be limited.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export interface ChatResponse {
  content: string;
  messageType: 'technical' | 'shakespeare' | 'other';
  metadata?: any;
}

export async function generateChatResponse(userMessage: string): Promise<ChatResponse> {
  try {
    // Check if API key is available
    if (!apiKey) {
      return {
        content: "I apologize, but the AI service is not properly configured. Please check your environment variables.",
        messageType: 'other',
        metadata: { error: 'API_KEY_MISSING' }
      };
    }

    // First, classify if the message is technical or not
    const classificationResponse = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: `You are a classifier that determines if a user's question is technical (programming, coding, software development, AI/ML, data science, algorithms, etc.) or non-technical. 
        Respond with JSON in this format: { "isTechnical": boolean, "confidence": number }
        confidence should be between 0 and 1.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            isTechnical: { type: "boolean" },
            confidence: { type: "number" },
          },
          required: ["isTechnical", "confidence"],
        },
      },
      contents: userMessage,
    });

    const rawJson = classificationResponse.text;
    const classification = rawJson ? JSON.parse(rawJson) : { isTechnical: false, confidence: 0.5 };

    if (classification.isTechnical && classification.confidence > 0.6) {
      // Generate technical response with code and guidelines
      const technicalResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: `You are WhyBot, an expert technical assistant. When users ask technical questions about programming, software development, AI/ML, or related topics, provide:
          1. Working code examples in appropriate languages
          2. Clear implementation guidelines
          3. Best practices and considerations
          4. Step-by-step explanations
          
          Format your response as a helpful technical guide with code blocks and actionable advice.`
        },
        contents: userMessage,
      });

      return {
        content: technicalResponse.text || "I apologize, but I couldn't generate a technical response.",
        messageType: 'technical',
        metadata: { language: 'mixed', classification: classification }
      };
    } else {
      // Generate Shakespearean or famous character response
      const characters = [
        "William Shakespeare",
        "Oscar Wilde", 
        "Mark Twain",
        "Winston Churchill",
        "Albert Einstein",
        "Maya Angelou"
      ];
      
      const selectedCharacter = characters[Math.floor(Math.random() * characters.length)];
      
      const characterResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: `You are WhyBot responding as ${selectedCharacter}. Answer the user's question in the distinctive voice, style, and wisdom of ${selectedCharacter}. 
          Capture their unique way of speaking, their philosophy, and their personality. Make it authentic to how they would actually respond.
          Keep responses thoughtful and engaging, typically 2-4 sentences unless the question requires more depth.`
        },
        contents: userMessage,
      });

      return {
        content: characterResponse.text || "Verily, I find myself at a loss for words, good sir or madam.",
        messageType: selectedCharacter.toLowerCase().includes('shakespeare') ? 'shakespeare' : 'other',
        metadata: { character: selectedCharacter, classification: classification }
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      content: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
      messageType: 'other',
      metadata: { error: 'API_ERROR', details: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}