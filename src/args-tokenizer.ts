const spaceRegex = /\s/;

type Options = {
  strict?: boolean;
};

/**
 * Tokenize a shell string into argv array
 */
export const tokenizeArgs = (
  argsString: string,
  options?: Options,
): string[] => {
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
  if (options?.strict && openningQuote) {
    throw Error("Unexpected end of string. Closing quote is missing.");
  }
  return tokens;
};
