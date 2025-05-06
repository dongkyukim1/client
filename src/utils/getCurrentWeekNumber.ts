export default function getCurrentWeekNumber() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000);
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}