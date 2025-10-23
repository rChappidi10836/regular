
import React from 'react';

interface AnimationControlsProps {
  currentFrame: number;
  totalFrames: number;
  onPrev: () => void;
  onNext: () => void;
  onPlayPause: () => void;
  isPlaying: boolean;
  disablePrev: boolean;
  disableNext: boolean;
}

const ControlButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; title?: string; className?: string }> = 
  ({ onClick, disabled = false, children, title, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`px-3 py-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-150 ${className}`}
  >
    {children}
  </button>
);


export const AnimationControls: React.FC<AnimationControlsProps> = ({
  currentFrame,
  totalFrames,
  onPrev,
  onNext,
  onPlayPause,
  isPlaying,
  disablePrev,
  disableNext
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-700/70 rounded-b-lg shadow-inner mt-auto">
      <ControlButton onClick={onPrev} disabled={disablePrev || totalFrames === 0} title="Previous Frame">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </ControlButton>
      
      <ControlButton onClick={onPlayPause} disabled={totalFrames === 0} title={isPlaying ? "Pause" : "Play"} className="min-w-[80px]">
        {isPlaying ? (
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Pause
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Play
          </div>
        )}
      </ControlButton>
      
      <div className="text-sm text-gray-300 tabular-nums">
        Frame: {totalFrames > 0 ? currentFrame : 0} / {totalFrames}
      </div>
      
      <ControlButton onClick={onNext} disabled={disableNext || totalFrames === 0} title="Next Frame">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </ControlButton>
    </div>
  );
};