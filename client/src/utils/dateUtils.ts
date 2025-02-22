export const formatMonthDay = (date: Date | string): string => {
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    console.error("Invalid date input:", date);
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(d);
};

export const formatTime = (date: Date): string => {
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    console.error("Invalid date input:", date);
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(d);
};

export const getDayName = (date: Date): string => {
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    console.error("Invalid date input:", date);
    return "Invalid Date";
  }

  const today = new Date();
  const tomorrow = addDays(today, 1);

  if (isSameDay(d, today)) {
    return "Today";
  }
  if (isSameDay(d, tomorrow)) {
    return "Tomorrow";
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
  };
  return new Intl.DateTimeFormat("en-US", options).format(d);
};

export const isSameDay = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    console.error("Invalid date input");
    return false;
  }

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getDaysUntil = (appointmentDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const apptDate = new Date(appointmentDate);
  apptDate.setHours(0, 0, 0, 0);

  const diffTime = apptDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
