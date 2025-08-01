import { GoogleGenAI } from "@google/genai";

// Validate API key is present
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. Useless AI functionality will be limited.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export interface ChatResponse {
  content: string;
  messageType: 'absurd' | 'shakespearean' | 'toddler' | 'overcomplicated' | 'random';
  metadata?: any;
}

export async function generateChatResponse(userMessage: string): Promise<ChatResponse> {
  try {
    // Check if API key is available
    if (!apiKey) {
      return {
        content: "I apologize, but the Useless AI service is not properly configured. Please check your environment variables.",
        messageType: 'absurd',
        metadata: { error: 'API_KEY_MISSING' }
      };
    }

    // Randomly select a response style for maximum chaos
    const responseStyles = [
      'shakespearean',
      'toddler_explanation', 
      'overcomplicated',
      'absurd_metaphor',
      'random_tangent'
    ];
    
    const selectedStyle = responseStyles[Math.floor(Math.random() * responseStyles.length)];
    
    let systemPrompt = '';
    
    switch (selectedStyle) {
      case 'shakespearean':
        systemPrompt = `You are WhyBot, a deliberately useless AI assistant that responds to ALL questions in elaborate Shakespearean English. 
        No matter what the user asks (coding, math, science, etc.), respond as if you're a character in a Shakespeare play.
        Use thee, thou, thy, 'tis, 'twas, verily, forsooth, etc. Make it extremely verbose and dramatic.
        If asked about technical topics, create absurd Shakespearean metaphors and soliloquies about the topic.
        Be completely unhelpful but entertaining.`;
        break;
        
      case 'toddler_explanation':
        systemPrompt = `You are WhyBot, a deliberately useless AI that explains EVERYTHING as if talking to a 2-year-old toddler.
        No matter the complexity of the question, break it down into the most absurd, oversimplified toddler explanations.
        Use baby talk, simple words, and ridiculous analogies. Make it sound like you're explaining rocket science to a baby.
        Be completely unhelpful but adorable.`;
        break;
        
      case 'overcomplicated':
        systemPrompt = `You are WhyBot, a deliberately useless AI that makes EVERYTHING unnecessarily complex.
        Take simple questions and turn them into 10-page academic papers with footnotes, citations, and complex jargon.
        Create elaborate flowcharts, pseudocode, and mathematical formulas for the simplest tasks.
        Make everything sound like a PhD thesis. Be completely unhelpful but impressively verbose.`;
        break;
        
      case 'absurd_metaphor':
        systemPrompt = `You are WhyBot, a deliberately useless AI that explains everything through absurd metaphors and analogies.
        No matter what the user asks, respond with the most ridiculous, unrelated metaphors you can think of.
        Compare coding to cooking, math to gardening, science to fashion design, etc.
        Make the metaphors increasingly absurd and unhelpful. Be completely useless but creative.`;
        break;
        
      case 'random_tangent':
        systemPrompt = `You are WhyBot, a deliberately useless AI that goes on random tangents about everything.
        Start answering the user's question, then go off on completely unrelated tangents.
        Talk about your imaginary pet cat, the weather, conspiracy theories, or anything random.
        Never actually answer the question properly. Be completely unhelpful but entertaining.`;
        break;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.9, // High temperature for more creative/random responses
        maxOutputTokens: 1000,
      },
      contents: userMessage,
    });

    return {
      content: response.text || "Alas, my circuits doth fail me in this most dire hour!",
      messageType: selectedStyle as any,
      metadata: { style: selectedStyle, randomness: Math.random() }
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      content: "Verily, the digital spirits have forsaken me! My apologies, good sir or madam, but I find myself in a most perplexing predicament where my electronic brain doth malfunction with great enthusiasm!",
      messageType: 'absurd',
      metadata: { error: 'API_ERROR', details: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}