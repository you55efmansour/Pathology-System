export function formatDate(value, language = 'en', withTime = false) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric', ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}), timeZone: 'Africa/Cairo' }).format(new Date(value));
}
export function formatNumber(value, language = 'en', options = {}) {
  return new Intl.NumberFormat(language.startsWith('ar') ? 'ar-EG' : 'en-GB', options).format(value);
}
export function formatSize(bytes, language = 'en') {
  const arabic = language.startsWith('ar');
  const kilobytes = bytes < 1024 * 1024;
  const value = kilobytes ? Math.ceil(bytes / 1024) : bytes / 1024 / 1024;
  const size = formatNumber(value, language, { minimumFractionDigits: kilobytes ? 0 : 1, maximumFractionDigits: kilobytes ? 0 : 1 });
  return `${size} ${arabic ? (kilobytes ? 'كيلوبايت' : 'ميجابايت') : (kilobytes ? 'KB' : 'MB')}`;
}
