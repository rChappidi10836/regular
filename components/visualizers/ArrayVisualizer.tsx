
import React from 'react';

interface ArrayVisualizerProps {
  name: string;
  values: (string | number)[];
  highlightIndices?: number[];
  changedIndices?: number[];
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ name, values, highlightIndices = [], changedIndices = [] }) => {
  return (
    <div className="p-3 bg-gray-700 rounded-lg shadow">
      <p className="text-sm font-semibold text-sky-300 mb-2">{name}:</p>
      <div className="flex flex-wrap gap-2 items-center justify-center">
        {values.map((value, index) => {
          const isHighlighted = highlightIndices.includes(index);
          const isChanged = changedIndices.includes(index);
          // Using a more robust key to help React with animations/transitions if needed.
          // Value change is important for re-render based effects.
          const key = `${name}-item-${index}-${String(value)}-${isHighlighted}-${isChanged}`;


          return (
            <div key={key} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center 
                            bg-gray-600 border-2 border-gray-500 rounded text-gray-100 font-mono text-sm md:text-base
                            transition-all duration-300 ease-in-out
                            ${isHighlighted ? 'array-element-highlight' : ''}
                            ${isChanged ? 'array-element-changed' : ''}`}
                title={`Index: ${index}, Value: ${value}`}
              >
                {String(value)}
              </div>
              <span className="mt-1 text-xs text-gray-400">{index}</span>
            </div>
          );
        })}
        {values.length === 0 && <p className="text-gray-400 italic">Array is empty</p>}
      </div>
    </div>
  );
};