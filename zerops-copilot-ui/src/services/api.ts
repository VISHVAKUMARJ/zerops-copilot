import { AnalyzeRequest, AiAnalysisResponse } from '../types';

const API_BASE_URL = ''; // Now handled by Vite proxy

export const analyzeDeployment = async (request: AnalyzeRequest): Promise<AiAnalysisResponse> => {
  const url = '/api/v1/ai/analyze';
  console.log("AI analysis request:", url);
  console.log("AI analysis payload:", request);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", response.status, errorText);
      throw new Error(`Backend error (${response.status}): ${errorText || 'Failed to reach Zerops Copilot backend'}`);
    }

    return await response.json();
  } catch (error) {
    console.error("AI analysis fetch error:", error);
    throw error;
  }
};
