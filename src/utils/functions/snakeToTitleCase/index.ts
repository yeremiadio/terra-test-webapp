export function snakeToTitleCase(str: string) {
  // Replace underscores with spaces, then insert spaces before capital letters (except the first letter), and capitalize the first letter
  const withSpaces = str
    .replace(/_/g, '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^ /, '');
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}
