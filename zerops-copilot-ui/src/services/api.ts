import { AnalyzeRequest, AiAnalysisResponse } from '../types';

const API_BASE_URL = '';

export const analyzeDeployment = async (
  request: AnalyzeRequest
): Promise<AiAnalysisResponse> => {
  const url = `${API_BASE_URL}/api/v1/ai/analyze`;

  console.log('AI analysis request:', url);
  console.log('AI analysis payload:', request);

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

      console.error(
        'Backend error response:',
        response.status,
        errorText
      );

      throw new Error(
        `Backend error (${response.status}): ${
          errorText || 'Failed to reach Zerops Copilot backend'
        }`
      );
    }

    const data: AiAnalysisResponse = await response.json();

    console.log('AI analysis response:', data);

    return data;
  } catch (error) {
    console.error('AI analysis fetch error:', error);
    throw error;
  }
};