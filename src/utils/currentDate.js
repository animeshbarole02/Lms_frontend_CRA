export const now = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 16);
