export const extractTimezone = (raw: string): string => {
  const match = raw.match(/[A-Za-z_]+\/[A-Za-z_]+/);
  return match ? match[0] : raw;
}
