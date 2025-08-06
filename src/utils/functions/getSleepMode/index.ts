export function getSleepMode(value: number): string {
  switch (value) {
    case 0:
      return 'No Sleep';
    case 1:
      return 'GPS Sleep';
    case 2:
      return 'Deep Sleep';
    case 3:
      return 'Online Sleep';
    case 4:
      return 'Ultra Sleep';
    default:
      return 'Unknown Sleep Mode';
  }
}
