export interface Message {
  role: 'user' | 'bot';
  text: string;
}

export interface ChatResponse {
  success: boolean;
  respuesta: string;
  infografiaUrl: string | null;
  fullurl: string | null;
  vecesConsultada: number;
  normalized: string;
  categoria: string;
}

export interface ChatRequest {
  pregunta: string;
}
