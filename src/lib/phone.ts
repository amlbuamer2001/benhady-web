/** Local Saudi mobile (05XXXXXXXX / 5XXXXXXXX) -> API format (9665XXXXXXXX). */
export function toApiPhone(local: string): string {
  const digits = local.replace(/\D/g, "").replace(/^0+/, "");
  return `966${digits}`;
}

/** 966587890123 -> +966 58 789 0123 */
export function formatApiPhone(apiPhone: string): string {
  const m = /^966(\d{2})(\d{3})(\d{4})$/.exec(apiPhone);
  return m ? `+966 ${m[1]} ${m[2]} ${m[3]}` : `+${apiPhone}`;
}
