export type GuessResult = {
  readonly bulls: number;
  readonly cows: number;
};

export const evaluateGuess = (secret: string, guess: string): GuessResult => {
  const secretChars = secret.toLowerCase().split('');
  const guessChars = guess.toLowerCase().split('');

  const bulls = guessChars.filter((char, i) => char === secretChars[i]).length;
  const common = guessChars.filter((char) => secretChars.includes(char)).length;

  return { bulls, cows: common - bulls };
};
