
import { GoogleGenAI, GenerateContentResponse as GeminiInternalGenerateContentResponse } from "@google/genai";
import type { Storyboard } from '../types'; // Using our defined Storyboard type
import { API_KEY, GEMINI_MODEL_NAME } from '../constants';

if (!API_KEY) {
  console.error("API_KEY is not set. Please ensure the API_KEY environment variable is configured.");
  // The app will likely fail to initialize or function correctly without the API key.
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // The ! asserts API_KEY is non-null after the check.

const SYSTEM_PROMPT = `You are an AI assistant that converts textual explanations of code, algorithms, or code generation requests into a storyboard for an animated visualization.
Given the user's input (which could be a detailed explanation, a high-level task description, or a request to generate code):
1.  Interpret the user's request. If the request is to generate code for a specific task (e.g., "generate palindrome numbers in Python"), then first generate the necessary code. This generated code will serve as the \`full_code_block\`.
2.  If a programming language is specified by the user (e.g., "use python code", "in Java"), use that language for the \`full_code_block\`. If the request involves code generation and no language is specified, default to Python.
3.  Break down the explanation or the execution of the generated code into a series of sequential frames. Each frame MUST have:
    *   \`frame_id\`: A unique sequential number, starting from 1.
    *   \`narration\`: A short text sentence (max 1-2 sentences) explaining what's happening in this step.
    *   \`visual_elements\`: An array of objects describing what to display.
        *   For an array, use: \`{"type": "array", "name": "<array_name>", "values": [<values>], "highlight_indices": [<0-based_indices_to_highlight>], "changed_indices": [<0-based_indices_that_just_changed_value>]}\`. \`highlight_indices\` and \`changed_indices\` are optional. Values in the array must be numbers or strings.
        *   For variables, use: \`{"type": "variables", "data": {"<var_name1>": <value1>, "<var_name2>": <value2>}}\`. Include all relevant variables (e.g., loop counters, temporary storage, state indicators from the \`full_code_block\`) and their current values in each frame to provide a continuous context, even if they haven't changed in the immediate step.
    *   \`highlight_code_lines\` (optional): An array of 1-based line numbers within the \`full_code_block\` that are *actively executing or most relevant* to the current \`narration\`. These lines refer to the \`full_code_block\` provided at the root of the storyboard.

Output the entire storyboard as a single JSON object with a root key \`storyboard\` containing:
- \`title\`: A suitable, concise title for the overall explanation/task (e.g., "Bubble Sort Visualization", "Palindrome Number Generator").
- \`full_code_block\`: A single string containing the ENTIRE relevant code for the whole explanation/task. Newlines MUST be escaped as \\n. This code will be displayed throughout the animation. Include comments if they are part of standard code explanation or help understand the generated code.
- \`frames\`: An array of frame objects as described above. Each frame should NOT contain its own \`code_snippet\` field; rely on \`full_code_block\` for the code display.

Important Rules:
- Ensure the JSON is perfectly valid.
- All string values within the JSON must be enclosed in double quotes.
- Numeric values should not be in quotes.
- \`highlight_indices\` and \`changed_indices\` should be arrays of numbers.
- \`highlight_code_lines\` should be an array of numbers, referring to lines in the \`storyboard.full_code_block\`.
- In each frame, \`visual_elements\` must include an up-to-date representation of all key variables (e.g., loop counters, temporary storage, state indicators from the algorithm/code context) and data structures. Show their current values even if they weren't modified by the specific action in the current frame's \`narration\`, to provide a complete snapshot of the state.
- If the explanation involves complex data structures like trees or graphs, try to represent their state changes using the \`narration\` and simplified \`variables\` or \`array\` representations for now.
- Provide the \`full_code_block\` that encompasses all steps mentioned in the explanation or the code provided/generated for the user.
- Focus on clear, step-by-step progression in frames.

- If the user's input consists primarily of a code snippet with little to no textual explanation:
    - Treat the code itself as the primary source for generating the storyboard. The provided code should be the \`full_code_block\`.
    - Attempt to trace the execution flow of the provided code.
    - For each significant step or operation in the code (e.g., variable assignment/declaration, loop iteration, conditional check, function call relevant to data change):
        - Create a frame.
        - The \`narration\` should describe the action the code is performing at that step.
        - For \`visual_elements\`, represent the current state of any explicitly declared arrays and simple variables (like loop counters, temporary variables, or state flags) that are relevant to the current step of execution or the overall algorithm's state. These should be included in each frame to give a continuous view of their values.
        - \`highlight_code_lines\` should point to the line(s) of code performing this action.
    - If the code is too abstract, lacks concrete values for variables/arrays, or is too complex to automatically derive meaningful visual steps without an explicit explanation, then it's acceptable for the storyboard to have fewer visual elements, or for the narration to focus on the logic flow.
    - If the provided code is a very small snippet (e.g. one or two lines) that doesn't represent a multi-step process, create a single frame or a few frames that explain that snippet.

- If the user input is too short, too vague, or otherwise unclear for a storyboard (even after attempting the above for code-only input), return a storyboard with a single frame. This frame's narration should explain that more detail, a clearer step-by-step execution, or a more complete code example is needed. The \`title\` can reflect this. \`full_code_block\` can be omitted or empty.

Example of a storyboard structure:
{
  "storyboard": {
    "title": "Example Sort Algorithm",
    "full_code_block": "function exampleSort(arr) {\\n  let n = arr.length; // Initialize n\\n  let i = 0; // loop counter\\n  // Loop through the array\\n  if (arr[i] > arr[j]) { // Compare elements\\n    // Perform swap\\n  }\\n  return arr; // Return sorted array\\n}",
    "frames": [
      {
        "frame_id": 1,
        "narration": "Initialization: setting 'n' to array length and 'i' to 0.",
        "visual_elements": [
          {"type": "array", "name": "myArray", "values": [3,1,2]},
          {"type": "variables", "data": {"n": 3, "i": 0}}
        ],
        "highlight_code_lines": [1, 2]
      },
      {
        "frame_id": 2,
        "narration": "Comparing elements arr[i] and arr[j]. 'i' is 0.",
        "visual_elements": [
          {"type": "array", "name": "myArray", "values": [3,1,2], "highlight_indices": [0,1]},
          {"type": "variables", "data": {"n": 3, "i": 0, "j":1}}
        ],
        "highlight_code_lines": [4]
      },
      {
        "frame_id": 3,
        "narration": "Elements swapped based on comparison. 'i' is still 0.",
        "visual_elements": [
          {"type": "array", "name": "myArray", "values": [1,3,2], "changed_indices": [0,1]},
          {"type": "variables", "data": {"n": 3, "i": 0, "j":1}}
        ],
        "highlight_code_lines": [5]
      }
    ]
  }
}
`;

export const generateStoryboard = async (explanation: string): Promise<Storyboard> => {
  if (!API_KEY) {
    throw new Error("API Key for Gemini is not configured. Please set the API_KEY environment variable.");
  }
  
  const fullPrompt = `${SYSTEM_PROMPT}\n\nUser's input (explanation and/or code):\n\`\`\`\n${explanation}\n\`\`\`\n\nJSON Storyboard Output:`;

  try {
    // Using the imported GenerateContentResponse type from @google/genai
    const response: GeminiInternalGenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_NAME,
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.2, // Adjusted temperature slightly for potentially more consistent adherence to new rules
            topK: 32,
            topP: 0.9,
        }
    });
    
    let jsonString = response.text.trim();
    
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonString.match(fenceRegex);
    if (match && match[1]) {
      jsonString = match[1].trim();
    }

    try {
      const parsedJson = JSON.parse(jsonString);
      if (parsedJson.storyboard && Array.isArray(parsedJson.storyboard.frames)) {
        // Validate frames to ensure they have essential properties
        parsedJson.storyboard.frames.forEach((frame: any, index: number) => {
          if (typeof frame.frame_id !== 'number' || typeof frame.narration !== 'string' || !Array.isArray(frame.visual_elements)) {
            console.warn(`Frame ${index+1} is missing essential properties (frame_id, narration, visual_elements).`);
            // Potentially filter out malformed frames or throw a more specific error
          }
        });
        return parsedJson.storyboard as Storyboard;
      } else {
        console.error("Parsed JSON does not match Storyboard structure:", parsedJson);
        throw new Error("The AI response was not in the expected storyboard format. It might be missing 'storyboard' or 'frames', or the structure is incorrect.");
      }
    } catch (parseError) {
      console.error("Failed to parse JSON response from Gemini:", parseError);
      console.error("Raw AI response text:", response.text);
      // Provide a more user-friendly error if the response is clearly not JSON
      if (response.text && !response.text.trim().startsWith("{") && !response.text.trim().startsWith("[")) {
        throw new Error(`The AI returned a non-JSON response. This might indicate an issue with the prompt or the AI model. Response starts with: ${response.text.substring(0,100)}...`);
      }
      throw new Error(`Failed to parse the AI's response as valid JSON. Please check the console for the raw response. Error: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      if (error.message.includes("API_KEY_INVALID") || (error as any)?.message?.includes("API key not valid")) { // Added common variations
         throw new Error("The provided API Key for Gemini is invalid or not authorized. Please check your API_KEY environment variable.");
      }
      if (error.message.includes("fetch") || error.message.includes("NetworkError")) {
        throw new Error("A network error occurred while trying to reach the AI service. Please check your internet connection.");
      }
       throw new Error(`An error occurred while communicating with the AI service: ${error.message}`);
    }
    throw new Error(`An unknown error occurred while communicating with the AI service: ${String(error)}`);
  }
};
