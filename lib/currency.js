/**
 * Centralized currency formatting using Intl.NumberFormat.
 * Change the locale and currency here to affect the entire app.
 */

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a number as currency (e.g. $1,234.56)
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return formatter.format(amount);
}

/**
 * Format a number as signed currency for transactions (e.g. +$1,234.56 or -$1,234.56)
 * @param {number} amount - The absolute amount
 * @param {"INCOME"|"EXPENSE"} type - Transaction type
 * @returns {string}
 */
export function formatSignedCurrency(amount, type) {
  const prefix = type === "EXPENSE" ? "-" : "+";
  return `${prefix}${formatter.format(Math.abs(amount))}`;
}
