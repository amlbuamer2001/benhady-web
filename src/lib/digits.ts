/** Arabic-Indic (٠-٩) and Persian (۰-۹) digits -> 0-9, then drops anything that isn't a digit. */
export function toLatinDigits(value: string): string {
  return value
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06f0-\u06f9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/\D/g, "");
}
