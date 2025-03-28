interface IAIChatService {
  processChatInteraction(message: string): Promise<string>;
}

export default IAIChatService;
