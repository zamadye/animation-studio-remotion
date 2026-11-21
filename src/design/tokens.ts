export const tokens = {
  color: { ink: '#20262b', paper: '#f3eee4', card: '#fffdf8', muted: '#76736d', rust: '#b64d37', teal: '#3b7772', line: '#d9d1c5', shadow: 'rgba(32,38,43,.14)' },
  type: { display: 'Arial, Helvetica, sans-serif', body: 'Arial, Helvetica, sans-serif', mono: 'ui-monospace, SFMono-Regular, monospace' },
  motion: { enter: 16, settle: 12, transition: 12 },
  safe: { vertical: {x:0.075,top:0.10,bottom:0.13}, square:{x:0.075,top:0.09,bottom:0.10}, landscape:{x:0.07,top:0.08,bottom:0.09} },
  reducedMotionDefault: false,
} as const;
