import { GoogleGenerativeAI } from "@google/generative-ai";

interface CareerInsights {
  growthOutlook: {
    trend: string;
    description: string;
  };
  salaryRanges: {
    min: number;
    avg: number;
    max: number;
    currency: string;
  };
  jobRoles: Array<{
    title: string;
    count: number;
  }>;
  technicalSkills: Array<{
    skill: string;
    importance: "High" | "Medium" | "Low";
  }>;
  softSkills: Array<{
    skill: string;
    importance: "High" | "Medium" | "Low";
  }>;
  topLocations: string[];
  marketDemand: string;
}

class GeminiCareerService {
  private genAI: GoogleGenerativeAI | null = null;

  initialize(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzeCareerField(
    careerField: string,
    location: string = "India"
  ): Promise<CareerInsights> {
    if (!this.genAI) {
      throw new Error("Gemini API not initialized. Please configure your API key in Settings.");
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        tools: [{ googleSearchRetrieval: {} }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const prompt = `Analyze the current job market for ${careerField} in ${location}. 
      
      Provide comprehensive, real-time insights including:
      1. Growth outlook (trend as "Growing", "Stable", or "Declining" and detailed description)
      2. Salary ranges in INR (minimum, average, maximum for professionals with 2-5 years experience)
      3. Top 5 common job roles with approximate number of current openings
      4. Top 8 technical skills required (with importance level: High/Medium/Low)
      5. Top 5 soft skills required (with importance level: High/Medium/Low)
      6. Top 3 hiring locations in ${location}
      7. Market demand description (2-3 sentences about current demand and future prospects)
      
      Return JSON in this exact structure:
      {
        "growthOutlook": {
          "trend": "Growing" | "Stable" | "Declining",
          "description": "string"
        },
        "salaryRanges": {
          "min": number,
          "avg": number,
          "max": number,
          "currency": "INR"
        },
        "jobRoles": [
          {"title": "string", "count": number}
        ],
        "technicalSkills": [
          {"skill": "string", "importance": "High" | "Medium" | "Low"}
        ],
        "softSkills": [
          {"skill": "string", "importance": "High" | "Medium" | "Low"}
        ],
        "topLocations": ["string"],
        "marketDemand": "string"
      }`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      const insights: CareerInsights = JSON.parse(response);
      return insights;
    } catch (error) {
      console.error("Error analyzing career field:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to analyze career field. Please try again."
      );
    }
  }
}

export const geminiService = new GeminiCareerService();
