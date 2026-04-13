export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const getYesterdayDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const isToday = (dateStr: string): boolean => {
  return dateStr === getTodayDate();
};

export const isYesterday = (dateStr: string): boolean => {
  return dateStr === getYesterdayDate();
};

export const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
