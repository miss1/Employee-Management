export const parseToken = <T>(token: string): T | null => {
  if (token) {
    try {
      const tokenParts = token.split('.');
      const encodedPayload = tokenParts[1];
      const decodedPayload = atob(encodedPayload);
      return JSON.parse(decodedPayload) as T;
    } catch (e) {
      console.error(String(e));
      return null;
    }
  }
  return null;
}