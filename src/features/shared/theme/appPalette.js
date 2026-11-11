// The same centralized palette pattern as Purchase, with pathology workspace colors.
export const appPalette = {
  primary: '22 103 91', 'primary-hover': '15 83 73', 'primary-strong': '18 85 75',
  'primary-soft': '231 243 239', 'primary-tint': '215 235 228', 'primary-ring': '102 163 150',
  surface: '255 255 255', 'surface-alt': '246 244 247', border: '226 220 228',
  ink: '49 40 52', text: '98 88 103', muted: '111 100 115', track: '235 230 237',
  'on-color': '255 255 255', shadow: '49 31 49',
  danger: '168 50 68', 'danger-hover': '143 35 53',
};
for (const [key, value] of Object.entries(appPalette)) document.documentElement.style.setProperty(`--app-${key}-rgb`, value);
