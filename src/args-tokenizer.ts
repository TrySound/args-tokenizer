const spaceRegex = /\s/;

/**
 * Tokenize a shell string into argv array
 */
export const tokenizeArgs = (argsString: string): string[] => {
  const tokens = [];
  let currentToken = "";
  let openningQuote: undefined | string;
  let escaped = false;
  for (let index = 0; index < argsString.length; index += 1) {
    const char = argsString[index];

    if (escaped) {
      escaped = false;
      // escape newline inside of quotes
      // ignore newline elsewhere
      if (openningQuote || char !== "\n") {
        currentToken += char;
      }
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (openningQuote === undefined && spaceRegex.test(char)) {
      if (currentToken.length > 0) {
        tokens.push(currentToken);
        currentToken = "";
      }
      continue;
    }

    if (char === "'" || char === '"') {
      if (openningQuote === undefined) {
        openningQuote = char;
        continue;
      }
      if (openningQuote === char) {
        openningQuote = undefined;
        continue;
      }
    }

    currentToken += char;
  }
  if (currentToken.length > 0) {
    tokens.push(currentToken);
  }
  return tokens;
};
