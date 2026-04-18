export function formatDate(input: Date | string, locale = "en-US") {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}
