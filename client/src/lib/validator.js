export function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export function validateRequired(values) {
  return Object.values(values).every((value) => String(value).trim() !== "");
}