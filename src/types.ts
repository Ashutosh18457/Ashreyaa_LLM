export type MessageRole = 'user' | 'assistant' | 'system';

export interface MessagePart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  groundingMetadata?: GroundingMetadata;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  base64?: string;
}

export interface GroundingMetadata {
  searchQueries?: string[];
  groundingChunks?: {
    web?: {
      uri: string;
      title: string;
    };
  }[];
}

export type AssistantCategory = 'general' | 'research' | 'coding' | 'business' | 'problem-solving' | 'automation' | 'satellite' | 'ml-engineer';

export interface AssistantConfig {
  category: AssistantCategory;
  model: string;
  systemInstruction: string;
}
