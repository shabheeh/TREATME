export const getDaysDifference = (date: string) => {
  const startDate = new Date(date);
  const endDate = new Date();

  const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

  const millisecondsInADay = 1000 * 60 * 60 * 24;
  const days = Math.floor(differenceInMilliseconds / millisecondsInADay);

  return days;
};
