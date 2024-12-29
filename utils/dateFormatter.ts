export const formatDate = (date: string, locale: string = "ar-SA") => {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
