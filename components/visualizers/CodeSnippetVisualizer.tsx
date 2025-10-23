
import React, { useState } from 'react';

interface CodeSnippetVisualizerProps {
  code: string;
  highlightLines?: number[]; // 1-based line numbers
}

// SVG Icons for the toggle button
const EyeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

export const CodeSnippetVisualizer: React.FC<CodeSnippetVisualizerProps> = ({ code, highlightLines = [] }) => {
  const [showComments, setShowComments] = useState(true);

  const formattedCode = code.replace(/\\n/g, '\n');
  const allLinesWithOriginalNumbers = formattedCode.split('\n').map((text, index) => ({
    originalLineNumber: index + 1,
    text: text,
  }));

  const linesToDisplay = allLinesWithOriginalNumbers.filter(lineObj => {
    if (showComments) {
      return true; // Show all lines if comments are visible
    }
    // If comments are hidden, filter them out
    const trimmedLine = lineObj.text.trim();
    const isSingleLineComment = trimmedLine.startsWith('//') || trimmedLine.startsWith('#');
    const isBlockCommentContained = trimmedLine.startsWith('/*') && trimmedLine.endsWith('*/');
    
    // This filters out lines that are purely single-line comments or self-contained block comments.
    // More complex multi-line block comment scenarios (e.g. a line that is just '*/') are not explicitly handled here
    // and would remain visible unless they also match other comment patterns (which is unlikely for just '*/').
    return !(isSingleLineComment || isBlockCommentContained);
  });

  const toggleShowComments = () => {
    setShowComments(prev => !prev);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1 pr-1">
        <h3 className="text-sm font-semibold text-gray-400 sticky top-0 bg-gray-900 py-1">Code Context:</h3>
        <button
          onClick={toggleShowComments}
          title={showComments ? "Hide comments" : "Show comments"}
          className="p-1.5 text-gray-400 hover:text-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500 rounded"
        >
          {showComments ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      </div>
      <pre className="bg-gray-950 p-3 rounded-md text-xs md:text-sm overflow-x-auto whitespace-pre font-mono text-gray-300">
        {linesToDisplay.map((lineObj) => {
          const { originalLineNumber, text } = lineObj;
          const isHighlighted = highlightLines.includes(originalLineNumber);
          
          const lineClass = `block ${isHighlighted ? 'highlight-line rounded' : ''} transition-colors duration-300 px-1 -mx-1`;

          return (
            <span 
              key={originalLineNumber} // Use original line number for a stable key
              className={lineClass}
            >
              <span className="select-none text-gray-600 mr-3 w-8 inline-block text-right">
                {originalLineNumber}
              </span>
              <span>
                {text}
              </span>
            </span>
          );
        })}
        {linesToDisplay.length === 0 && allLinesWithOriginalNumbers.length > 0 && (
             <span className="block px-1 -mx-1 text-gray-500 italic">
                 <span className="select-none text-gray-600 mr-3 w-8 inline-block text-right">&nbsp;</span>
                 (All lines are hidden comments)
            </span>
        )}
         {allLinesWithOriginalNumbers.length === 0 && (
             <span className="block px-1 -mx-1 text-gray-500 italic">
                 <span className="select-none text-gray-600 mr-3 w-8 inline-block text-right">&nbsp;</span>
                 (No code to display)
            </span>
        )}
      </pre>
    </div>
  );
};
