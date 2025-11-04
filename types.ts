
export interface ProcessedImage {
  id: string;
  originalFile: File;
  originalUrl: string;
  generatedUrl: string | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}
