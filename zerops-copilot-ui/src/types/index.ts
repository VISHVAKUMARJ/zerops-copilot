export interface AiAnalysisResponse {
  severity?: string;
  confidence: number;
  rootCause?: string;
  summary: string;
  recommendations?: string;
  recommendedFix?: string[];
  filesToCheck?: string[];
}

export interface AnalyzeRequest {
  deploymentId: string;
  logs: string;
}