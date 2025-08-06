export function getGsmSignalStatus(value: number): string {
  switch (value) {
    case 0:
      return 'No Signal';
    case 2:
      return 'Poor Signal';
    case 3:
      return 'Fair Signal';
    case 4:
      return 'Good Signal';
    case 5:
      return 'Excellent Signal';
    default:
      return 'Unknown GSM Signal';
  }
}
