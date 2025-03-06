import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const formatMonthDay = (date: Date | string): string => {
  const d = dayjs(date);

  if (!d.isValid()) {
    console.error("Invalid date input:", date);
    return "Invalid Date";
  }

  return d.format("MMM D");
};

export const formatTime = (date: Date | string): string => {
  const d = dayjs(date);

  if (!d.isValid()) {
    console.error("Invalid date input:", date);
    return "Invalid Date";
  }

  return d.format("hh:mm A");
};

export const getDayName = (date: Date | string): string => {
  const d = dayjs(date);

  if (!d.isValid()) {
    console.error("Invalid date input:", date);
    return "Invalid Date";
  }

  const today = dayjs();
  const tomorrow = today.add(1, "day");

  if (d.isSame(today, "day")) {
    return "Today";
  }
  if (d.isSame(tomorrow, "day")) {
    return "Tomorrow";
  }

  return d.format("dddd");
};

export const isSameDay = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);

  if (!d1.isValid() || !d2.isValid()) {
    console.error("Invalid date input");
    return false;
  }

  return d1.isSame(d2, "day");
};

export const addDays = (date: Date | string, days: number): Date => {
  const d = dayjs(date);

  if (!d.isValid()) {
    console.error("Invalid date input:", date);
    return new Date();
  }

  return d.add(days, "day").toDate();
};

export const getDaysDifference = (appointmentDate: Date | string): number => {
  const today = dayjs().startOf("day");
  const apptDate = dayjs(appointmentDate).startOf("day");

  if (!apptDate.isValid()) {
    console.error("Invalid date input:", appointmentDate);
    return 0;
  }

  const diffTime = apptDate.diff(today, "day");
  return Math.ceil(diffTime);
};

export const formatMessageTime = (timestamp: string | Date): string => {
  const date = dayjs(timestamp);
  const now = dayjs();

  const diffInSeconds = now.diff(date, "second");
  if (diffInSeconds < 60) {
    return "few seconds ago";
  }

  const diffInMinutes = now.diff(date, "minute");
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = now.diff(date, "hour");
  if (diffInHours < 24) {
    return date.fromNow();
  }

  const diffInDays = now.diff(date, "day");
  if (diffInDays === 1) {
    return "yesterday";
  }

  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  return date.format("MMMM D, YYYY");
};
