export function sanitizeId(id: string): string {
  return id.replace(/'/g, '');
}
