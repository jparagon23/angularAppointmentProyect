export class Functions {
  static splitAndcapitalizeFirstLetter(str: string): string {
    // Split the input string based on camelCase pattern
    const words = str.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');

    // Capitalize the first letter of each word
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );

    // Join the capitalized words to form the final string
    const result = capitalizedWords.join(' ');

    return result;
  }
}
