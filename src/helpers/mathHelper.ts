import Decimal from 'decimal.js';

/**
 * Rounds the given number to two decimal places.
 *
 * @param amount The number to round.
 * @returns The rounded number.
 */
export function roundTwoDecimals(amount: number): number {
  // Create a Decimal object with the given amount.
  const decimal = new Decimal(amount);

  // Round the decimal to two decimal places and convert to a number.
  const roundedNumber = decimal.toDecimalPlaces(2).toNumber();

  // Return the rounded number.
  return roundedNumber;
}

export function add(a: number, b: number): number {
  a = a ? a : 0;
  b = b ? b : 0;
  return Decimal.add(a, b).toNumber();
}

export function divide(a: number, b: number): number {
  return Decimal.div(a, b).toNumber();
}

export function mutiply(a: number, b: number): number {
  return Decimal.mul(a, b).toNumber();
}
