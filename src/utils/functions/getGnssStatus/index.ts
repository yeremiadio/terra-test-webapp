export function getGnssStatus(value: number): string {
  switch (value) {
    case 0:
      return 'GNSS OFF';
    case 1:
      return 'GNSS ON with fix';
    case 2:
      return 'GNSS ON without fix';
    case 3:
      return 'GNSS sleep';
    default:
      return 'Unknown GNSS Status';
  }
}
