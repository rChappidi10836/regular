
import React, { useRef } from 'react';

interface UserInputProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>; // Added ref prop
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onReset: () => void;
}

export const UserInput: React.FC<UserInputProps> = ({ textareaRef, value, onChange, onGenerate, isLoading, onReset }) => {
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault(); // Prevent default action (e.g., newline)
      if (!isLoading && value.trim()) {
        onGenerate();
      }
    }
  };

  const handleResetClick = () => {
    onReset();
    resetButtonRef.current?.blur(); // Blur the reset button after its action
  };

  return (
    <div className="flex flex-col space-y-3 h-full">
      <label htmlFor="explanation-input" className="text-lg font-semibold text-sky-300">
        Enter Code Explanation:
      </label>
      <textarea
        ref={textareaRef} // Assign the ref
        id="explanation-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleTextareaKeyDown} // Added keydown handler
        placeholder="Paste or type your code explanation here... (Ctrl+Enter to generate)"
        className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none min-h-[200px] text-sm text-gray-200 placeholder-gray-400"
        disabled={isLoading}
      />
      <div className="flex space-x-2">
        <button
          onClick={onGenerate}
          disabled={isLoading || !value.trim()}
          className="w-full px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </div>
          ) : (
            'Generate Animation'
          )}
        </button>
        <button
          ref={resetButtonRef}
          onClick={handleResetClick} // Use the new handler
          disabled={isLoading}
          className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          title="Reset Animation Playback / Input Form"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
