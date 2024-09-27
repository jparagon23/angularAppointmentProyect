export class Functions {
  static splitAndCapitalizeFirstLetter(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Split based on camelCase pattern
      .split(' ') // Split into words
      .map((word, index) =>
        index === 0
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : word.toLowerCase()
      ) // Capitalize first letter of the first word, lowercase others
      .join(' '); // Join words to form the final string
  }
}
