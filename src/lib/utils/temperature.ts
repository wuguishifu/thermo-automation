/**
 * Temperature conversion utilities
 * All internal data is stored in Celsius, these utilities handle conversion for display
 */

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return celsius * 1.8 + 32;
}

/**
 * Convert Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) / 1.8;
}

/**
 * Convert temperature based on display preference
 * @param celsiusValue - Temperature in Celsius (internal storage format)
 * @param displayUnit - Display unit preference
 * @returns Temperature in the requested unit
 */
export function convertTemperature(celsiusValue: number, displayUnit: 'Fahrenheit' | 'Celsius'): number {
  if (displayUnit === 'Fahrenheit') {
    return celsiusToFahrenheit(celsiusValue);
  }
  return celsiusValue;
}

/**
 * Convert temperature for input (from display unit to Celsius for storage)
 * @param displayValue - Temperature in display unit
 * @param displayUnit - Display unit preference
 * @returns Temperature in Celsius (for storage)
 */
export function convertTemperatureForStorage(displayValue: number, displayUnit: 'Fahrenheit' | 'Celsius'): number {
  if (displayUnit === 'Fahrenheit') {
    return fahrenheitToCelsius(displayValue);
  }
  return displayValue;
}

/**
 * Convert temperature for non-localized display
 * @param displayValue - Temperature in display unit
 * @param displayUnit - Display unit preference
 * @returns Temperature in the requested unit
 */
export function convertNonLocalizedTemperature(displayValue: number, displayUnit: 'Fahrenheit' | 'Celsius'): number {
  if (displayUnit === 'Fahrenheit') {
    // We don't subtract 32 here because we're not displaying an actual temperature
    return displayValue / 1.8;
  }
  return displayValue;
}

/**
 * Get temperature unit symbol
 */
export function getTemperatureUnitSymbol(displayUnit: 'Fahrenheit' | 'Celsius'): string {
  return displayUnit === 'Fahrenheit' ? '°F' : '°C';
}

/**
 * Format temperature with appropriate precision and unit
 */
export function formatTemperature(celsiusValue: number, displayUnit: 'Fahrenheit' | 'Celsius', precision = 1): string {
  const convertedValue = convertTemperature(celsiusValue, displayUnit);
  const unit = getTemperatureUnitSymbol(displayUnit);
  return `${convertedValue.toFixed(precision)}${unit}`;
}
