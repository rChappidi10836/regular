
export interface VisualElementArray {
  type: 'array';
  name: string;
  values: (string | number)[];
  highlight_indices?: number[];
  changed_indices?: number[];
}

export interface VisualElementVariables {
  type: 'variables';
  data: Record<string, string | number | boolean | null>;
}

export type VisualElement = VisualElementArray | VisualElementVariables;

export interface Frame {
  frame_id: number;
  narration: string;
  visual_elements: VisualElement[];
  code_snippet?: string; // Kept for potential backward compatibility, but discouraged by new prompt.
  highlight_code_lines?: number[]; // These now refer to full_code_block
}

export interface Storyboard {
  title: string;
  frames: Frame[];
  full_code_block?: string; // Entire code for the animation
}

// For Gemini API responses - aligned with @google/genai
// Note: GenerateContentResponse from @google/genai already covers most of this.
// This file defines types for the *storyboard structure*, not directly for Gemini SDK types.
// However, keeping GeminiGenerateContentResponse as it was in existing code,
// but it might be redundant if @google/genai types are directly used in service layer.

export interface GeminiSafetySetting {
  category: string;
  threshold: string;
}

export interface GeminiGenerationConfig {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
  responseMimeType?: string;
}

export interface GeminiContentPart {
  text?: string;
  // Add other part types if needed, e.g., inlineData for images
}

export interface GeminiContent {
  parts: GeminiContentPart[];
  role?: string;
}

export interface GeminiCandidate {
  content: GeminiContent;
  finishReason?: string;
  index?: number;
  safetyRatings?: GeminiSafetySetting[];
  // Add groundingMetadata if using search grounding
  groundingMetadata?: {
    groundingChunks?: { web: { uri: string; title: string } }[];
    // other grounding fields
  };
}

export interface GeminiPromptFeedback {
  safetyRatings: GeminiSafetySetting[];
  // other feedback fields
}

// This mirrors structure, but actual type comes from @google/genai
export interface GeminiGenerateContentResponse {
  candidates: GeminiCandidate[];
  promptFeedback?: GeminiPromptFeedback;
  text: string; // Convenience accessor for text part of first candidate
}
