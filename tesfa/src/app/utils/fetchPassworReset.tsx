const baseUrl = '/api/password-reset';

export async function fetchPasswordReset(payload: { email: string }) {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {

      const errorText = await response.text();
      throw new Error('Failed to request password reset: ' + (errorText || response.statusText));
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`Error requesting password reset: ${(error as Error).message}`);
  }
}
