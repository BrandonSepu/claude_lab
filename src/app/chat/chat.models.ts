export interface Message {
  role: 'user' | 'bot';
  text: string;
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  infografiaUrl: string | null;
  vecesConsultada: number;
  normalizedQuestion: string;
  category: string;
}

export interface ChatRequest {
  pregunta: string;
}
