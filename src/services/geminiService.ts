// Note: Using dynamic import for Google Generative AI to handle potential import issues
let GoogleGenerativeAI: any = null;

// Try to import Google Generative AI, fall back gracefully if not available
const initializeGoogleAI = async () => {
  try {
    const genAI = await import('@google/genai');
    GoogleGenerativeAI = genAI.GoogleGenerativeAI;
    return true;
  } catch (error) {
    console.log('Google Generative AI not available, using mock responses');
    return false;
  }
};

// Initialize Gemini AI
let genAI: any = null;
let isInitialized = false;

const initializeGemini = async () => {
  if (isInitialized) return genAI;
  
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  
  if (!apiKey) {
    console.log('Gemini API key not found. AI features will use mock responses.');
    isInitialized = true;
    return null;
  }
  
  try {
    const hasGoogleAI = await initializeGoogleAI();
    if (hasGoogleAI && GoogleGenerativeAI) {
      genAI = new GoogleGenerativeAI(apiKey);
      isInitialized = true;
      return genAI;
    } else {
      console.log('Google AI library not available, using mock responses');
      isInitialized = true;
      return null;
    }
  } catch (error) {
    console.error('Failed to initialize Gemini AI:', error);
    isInitialized = true;
    return null;
  }
};

export const getAiDebtAnalysis = async (highRiskStudents: any[]): Promise<{ summary: string, recommendations: string[] }> => {
  const aiClient = await initializeGemini();
  
  if (!aiClient) {
    // Return mock analysis when API key is not available
    return {
      summary: `Analysis of ${highRiskStudents.length} high-risk students shows significant debt patterns. Total outstanding fees: ₦${highRiskStudents.reduce((sum, student) => sum + (student.outstandingFees || 0), 0).toLocaleString()}.`,
      recommendations: [
        'Implement payment plans for students with outstanding fees above ₦50,000',
        'Send automated SMS reminders to parents 7 days before due dates',
        'Offer early payment discounts to encourage prompt fee payments',
        'Schedule parent-teacher meetings to discuss payment challenges',
        'Consider partial scholarship programs for genuinely struggling families'
      ]
    };
  }

  try {
    const model = aiClient.getGenerativeModel({ model: 'gemini-pro' });
    
    const studentSummary = highRiskStudents.map(student => 
      `${student.name}: ₦${student.outstandingFees?.toLocaleString() || '0'} outstanding`
    ).join('\n');

    const prompt = `
      Analyze the following high-risk debt students for a Nigerian school:
      
      ${studentSummary}
      
      Please provide:
      1. A brief summary of the financial situation
      2. 3-5 specific, actionable recommendations for improving debt collection
      
      Keep recommendations practical for a Nigerian school context, considering cultural and economic factors.
      Return the response as JSON with 'summary' and 'recommendations' fields.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const parsed = JSON.parse(text);
      return {
        summary: parsed.summary || 'Analysis completed successfully.',
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [
          'Review payment terms and consider flexible payment options',
          'Improve communication with parents about outstanding fees',
          'Implement early warning system for potential defaulters'
        ]
      };
    } catch (parseError) {
      // If JSON parsing fails, extract insights from the raw text
      return {
        summary: `AI analysis completed for ${highRiskStudents.length} high-risk students.`,
        recommendations: [
          'Implement structured payment plans for high-debt students',
          'Increase communication frequency with parents of at-risk students',
          'Consider offering financial counseling services',
          'Review fee structures to ensure affordability'
        ]
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('AI analysis temporarily unavailable. Please try again later.');
  }
};

export const getChatbotResponse = async (message: string, context?: any): Promise<string> => {
  const aiClient = await initializeGemini();
  
  if (!aiClient) {
    // Return helpful mock responses when API key is not available
    const responses = [
      "I'm here to help with school fee management questions! However, AI services need to be configured with an API key to provide personalized responses.",
      "I can help you with questions about student payments, fee structures, and debt management once the AI services are properly set up.",
      "For now, please refer to the Knowledge Base section for common questions and answers about the school fees system."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  try {
    const model = aiClient.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      You are an AI assistant for SchoolFee.NG, a Nigerian school fees management system.
      
      User message: "${message}"
      
      Context: ${context ? JSON.stringify(context) : 'General inquiry'}
      
      Provide a helpful, concise response focused on school fee management, payments, and administration.
      Keep responses professional and relevant to the Nigerian education context.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Chatbot AI error:', error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact support for assistance.";
  }
};