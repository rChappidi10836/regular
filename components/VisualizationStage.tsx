
import React from 'react';
import type { Frame } from '../types';
import { ArrayVisualizer } from './visualizers/ArrayVisualizer';
import { VariablesVisualizer } from './visualizers/VariablesVisualizer';
import { CodeSnippetVisualizer } from './visualizers/CodeSnippetVisualizer';

interface VisualizationStageProps {
  frame: Frame | null;
  fullCodeBlock?: string; // The entire code block for the animation
}

export const VisualizationStage: React.FC<VisualizationStageProps> = ({ frame, fullCodeBlock }) => {
  if (!frame) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-800/50 rounded-lg p-4 text-gray-500">
        <p>No animation frame to display. Generate an animation first.</p>
      </div>
    );
  }

  const hasVisualElements = frame.visual_elements && frame.visual_elements.length > 0;
  const hasCodeToShow = !!fullCodeBlock; // Determine if code area should be shown based on fullCodeBlock

  return (
    <div className="flex-grow flex flex-col space-y-4 p-4 bg-gray-850/70 rounded-lg overflow-auto min-h-0">
      {/* Narration */}
      {frame.narration && (
        <div className="p-3 bg-sky-800/60 border border-sky-700 rounded-md shadow text-center">
          <p className="text-md font-medium text-sky-100">{frame.narration}</p>
        </div>
      )}

      {/* Visual Elements Area */}
      <div className={`flex-grow grid grid-cols-1 ${hasCodeToShow && hasVisualElements ? 'lg:grid-cols-2' : ''} gap-4 min-h-[200px] items-start`}>
        {/* Full Code Block (if present) */}
        {hasCodeToShow && (
           <div className={`bg-gray-900 p-3 rounded-md shadow-lg h-full overflow-auto ${!hasVisualElements ? 'lg:col-span-2' : ''}`}>
             {/* Title is now part of CodeSnippetVisualizer */}
             <CodeSnippetVisualizer
               code={fullCodeBlock!} // Pass the full code block
               highlightLines={frame.highlight_code_lines}
             />
           </div>
        )}

        {/* Data Structures (arrays, variables) */}
        {hasVisualElements && (
          <div className={`flex flex-col space-y-4 ${!hasCodeToShow ? 'lg:col-span-2 justify-center items-center' : ''}`}>
            {frame.visual_elements.map((element, index) => (
              <div key={index} className="w-full">
                {element.type === 'array' && (
                  <ArrayVisualizer
                    name={element.name}
                    values={element.values}
                    highlightIndices={element.highlight_indices}
                    changedIndices={element.changed_indices}
                  />
                )}
                {element.type === 'variables' && (
                  <VariablesVisualizer data={element.data} />
                )}
              </div>
            ))}
          </div>
        )}
        
        {!hasVisualElements && !hasCodeToShow && (
            <div className="lg:col-span-2 flex-grow flex items-center justify-center text-gray-500">
             <p className="text-center">No visual elements or code for this step.</p>
            </div>
        )}
      </div>
    </div>
  );
};
