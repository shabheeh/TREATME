export const getDateRange = (
  timeFilter: "weekly" | "monthly" | "yearly" | "custom",
  startDate?: Date,
  endDate?: Date
): { startDate: Date; endDate: Date } => {
  const now = new Date();

  switch (timeFilter) {
    case "weekly": {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);
      return { startDate: weekStart, endDate: now };
    }

    case "monthly": {
      const monthStart = new Date(now);
      monthStart.setMonth(now.getMonth() - 1);
      return { startDate: monthStart, endDate: now };
    }

    case "yearly": {
      const yearStart = new Date(now);
      yearStart.setFullYear(now.getFullYear() - 1);
      return { startDate: yearStart, endDate: now };
    }

    case "custom":
      return {
        startDate:
          startDate ||
          new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
        endDate: endDate || new Date(),
      };

    default: {
      const defaultStart = new Date(now);
      defaultStart.setMonth(now.getMonth() - 1);
      return { startDate: defaultStart, endDate: now };
    }
  }
};
