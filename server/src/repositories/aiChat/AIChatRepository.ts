import axios from "axios";
import { AppError } from "../../utils/errors";
import { GoogleAIFullResponse } from "./interface/IAIChatRepository";
import { injectable } from "inversify";

@injectable()
class AIChatRepository {
  private apiKey: string;
  private readonly API_BASE_URL: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_GENERATIVE_AI_KEY || "";
    this.API_BASE_URL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  }

  async generateAIResponse(message: string): Promise<string> {
    try {
      const contextualPrompt = this.constructContextualPrompt(message);
      const response = await axios.post(
        `${this.API_BASE_URL}?key=${this.apiKey}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: contextualPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      return this.extractResponseText(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Detailed Axios Error:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });

        if (error.response) {
          throw new AppError(
            `AI Service Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
            error.response.status
          );
        } else if (error.request) {
          throw new AppError("No response received from AI Service", 503);
        } else {
          throw new AppError(`Request Setup Error: ${error.message}`, 500);
        }
      }

      throw new AppError(
        `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  private constructContextualPrompt(userMessage: string): string {
    return `
      You are an AI assistant for a telemedicine application called treatme. 
      Provide helpful, compassionate, and accurate responses about:
      - General app navigation
      - Booking appointments
      - Understanding medical services
      - Basic health information

      Context: Telemedicine application user interaction
      User query: ${userMessage}
    `;
  }

  private extractResponseText(responseData: GoogleAIFullResponse): string {
    return (
      responseData.candidates[0]?.content?.parts[0]?.text ||
      "No response generated by the AI."
    );
  }
}

export default AIChatRepository;
