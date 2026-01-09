export const formatDate = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const getClockTime = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24 hours format
  });
};
