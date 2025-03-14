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

export function getFormattedName(
  fullName: string,
  fullLastName: string
): string {
  if (!fullName || !fullLastName) return '';

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const secondNameInitial = nameParts[1] ? nameParts[1][0] + '.' : '';

  const lastNameParts = fullLastName.split(' ');
  const firstLastName = lastNameParts[0];

  return secondNameInitial
    ? `${firstName} ${secondNameInitial} ${firstLastName}`
    : `${firstName} ${firstLastName}`;
}
