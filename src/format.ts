const pad = (value: number): string => String(value).padStart(2, '0');

export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1000);

  return `${pad(Math.floor(totalSeconds / 60))}:${pad(totalSeconds % 60)}`;
};
