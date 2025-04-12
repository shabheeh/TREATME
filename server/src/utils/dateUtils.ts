export const extractDate = (date: Date): string => {
  if (!date || !(date instanceof Date)) {
    throw new Error("Invalid date provided");
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const extractTime = (date: Date): string => {
  if (!date || !(date instanceof Date)) {
    throw new Error("Invalid date provided");
  }

  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
};

export const getLocalizedDateTime = (
  date: Date,
  timeZone: string
): { date: string; time: string } => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  const formattedDate = date.toLocaleDateString("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return {
    date: formattedDate,
    time: formattedTime,
  };
};
