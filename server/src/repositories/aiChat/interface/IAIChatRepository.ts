interface IAIChatRepository {
  generateAIResponse(message: string): Promise<string>;
}

export default IAIChatRepository;

export interface GoogleAIResponsePart {
  text: string;
}

export interface GoogleAIResponseContent {
  parts: GoogleAIResponsePart[];
}

export interface GoogleAIResponseCandidate {
  content: GoogleAIResponseContent;
}

export interface GoogleAIFullResponse {
  candidates: GoogleAIResponseCandidate[];
}
