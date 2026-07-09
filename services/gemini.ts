type GeminiAction = 'plan' | 'visual-demo' | 'chat';

const API_PATH = '/api/ai';

async function postToGeminiApi<T>(action: GeminiAction, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_PATH}/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`AI request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const generateProjectPlan = async (userIdea: string): Promise<string> => {
  const data = await postToGeminiApi<{ text?: string }>('plan', { userIdea });
  return data.text || 'System plan is not available right now.';
};

export const generateVisualDemo = async (userIdea: string): Promise<any> => {
  try {
    const data = await postToGeminiApi<{ demo?: unknown }>('visual-demo', { userIdea });
    return data.demo || null;
  } catch (error) {
    console.error('Visual generation request failed:', error);
    return null;
  }
};

export const chatWithAI = async (message: string, history: any[]): Promise<string> => {
  try {
    const data = await postToGeminiApi<{ text?: string }>('chat', { message, history });
    return data.text || '';
  } catch (error) {
    console.error('AI chat request failed:', error);
    return 'The assistant is not available right now. Please try again later.';
  }
};
