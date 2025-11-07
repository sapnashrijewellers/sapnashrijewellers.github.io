// utils/slug.js
export function toSlugKeepUnicode(text) {
  if (!text) return "";
  // normalize spaces, trim
  text = String(text).trim();

  // replace multiple spaces/tabs/newlines with single space
  text = text.replace(/\s+/g, "-");

 
  return text || "";
}