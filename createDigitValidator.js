export const DIGITS = '0123456789abcdef';
export const createDigitValidator = (base) => {
    const alphabet = DIGITS.slice(0, base).split('');
    return (char) => alphabet.includes(char.toLowerCase());
};
