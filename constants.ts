
// In a real application, this API_KEY would be set through environment variables
// and not hardcoded. For this exercise, it's used directly as per instructions
// which assume process.env.API_KEY is pre-configured in the execution environment.
// If process.env.API_KEY is undefined, the geminiService will throw an error.
export const API_KEY = process.env.API_KEY;

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const INITIAL_EXPLANATION = `
Explain the Bubble Sort algorithm.
Start with an array: numbers = [5, 1, 4, 2, 8]

First pass:
Compare 5 and 1. Swap. Array becomes [1, 5, 4, 2, 8].
Compare 5 and 4. Swap. Array becomes [1, 4, 5, 2, 8].
Compare 5 and 2. Swap. Array becomes [1, 4, 2, 5, 8].
Compare 5 and 8. No swap. Array remains [1, 4, 2, 5, 8].
End of first pass. Largest element 8 is in place.

Second pass:
Compare 1 and 4. No swap.
Compare 4 and 2. Swap. Array becomes [1, 2, 4, 5, 8].
Compare 4 and 5. No swap.
End of second pass. Element 5 is in place.

Third pass:
Compare 1 and 2. No swap.
Compare 2 and 4. No swap.
End of third pass. Element 4 is in place.

Fourth pass:
Compare 1 and 2. No swap.
End of fourth pass. Element 2 is in place.

Array is sorted: [1, 2, 4, 5, 8].
`;