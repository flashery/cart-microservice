/**
 * Generates a random string of the specified length
 * @param {number} length - Length of the generated string
 * @returns {string} - Randomly generated string
 */
function generateRandomString(length: number): string {
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  // Loop through the length of the string and randomly select characters from `chars`
  for (let i = length; i > 0; i -= 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  // Return the generated string
  return result;
}

/**
 * Generates a Universally Unique Identifier (UUID) with a length of 24 characters.
 * @returns A string representing the UUID.
 */
export function createUUId(): string {
  // Generate a random string with a length of 24 characters
  return generateRandomString(24);
}
