export const formatPrice = (amount) => {
  if (!amount || amount === 0) return 'Free';
  return `KSh ${Number(amount).toLocaleString()}`;
};

export const formatDuration = (minutes) => {
  if (!minutes) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
