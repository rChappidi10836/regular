
import React from 'react';

interface VariablesVisualizerProps {
  data: Record<string, string | number | boolean | null>;
}

export const VariablesVisualizer: React.FC<VariablesVisualizerProps> = ({ data }) => {
  const entries = Object.entries(data);

  if (entries.length === 0) {
    return (
      <div className="p-3 bg-gray-700 rounded-lg shadow">
        <p className="text-sm font-semibold text-sky-300 mb-1">Variables:</p>
        <p className="text-gray-400 italic">No variables to display for this step.</p>
      </div>
    );
  }

  return (
    <div className="p-3 bg-gray-700 rounded-lg shadow">
      <p className="text-sm font-semibold text-sky-300 mb-2">Variables:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-baseline bg-gray-650 p-1.5 rounded">
            <span className="font-mono text-teal-400 mr-2">{key}:</span>
            <span className="font-mono text-amber-300 truncate" title={String(value)}>
              {value === null ? 'null' : typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};