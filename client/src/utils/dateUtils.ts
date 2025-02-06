
export function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  
  export function formatTime(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  
  export function isSameDay(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  
  export function isBefore(date1: Date, date2: Date) {
    return date1 < date2;
  }
  
  export function isBetween(date: Date, startDate: Date, endDate: Date) {
    return date >= startDate && date <= endDate;
  }
  
  export function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }