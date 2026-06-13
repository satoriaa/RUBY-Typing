import { generate } from "random-words";

export const generateRandomText = (wordCount = 100) => {
    const wordsArray = generate(wordCount);
    return wordsArray.join(" ");
}