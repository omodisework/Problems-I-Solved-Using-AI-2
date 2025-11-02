export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  country: string | null;
  error: string | null;
  loading: boolean;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
  placeAnswerSources?: {
    reviewSnippets: {
      uri: string;
      title: string;
    }[];
  };
}

export interface SearchResult {
  text: string;
  groundingChunks: GroundingChunk[];
}

export interface ApiKeyError {
  isError: boolean;
  message: string;
}

// Define the AIStudio interface globally to avoid type conflicts
export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}
