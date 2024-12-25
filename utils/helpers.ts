export function generateId() {
  return Math.random().toString(36).substring(2);
}

export const getColorValue = (colorClass: string) => {
  if (colorClass.includes("violet")) return "#7C3AED";
  if (colorClass.includes("blue")) return "#3B82F6";
  if (colorClass.includes("sky")) return "#0EA5E9";
  return "#000000";
};
