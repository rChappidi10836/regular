
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { UserInput } from './components/UserInput';
import { AnimationControls } from './components/AnimationControls';
import { VisualizationStage } from './components/VisualizationStage';
import { generateStoryboard } from './services/geminiService';
import type { Storyboard, Frame } from './types';
import { INITIAL_EXPLANATION } from './constants';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>(INITIAL_EXPLANATION);
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const userInputRef = useRef<HTMLTextAreaElement>(null); // Ref for the textarea

  const handleGenerateAnimation = useCallback(async () => {
    if (!userInput.trim()) {
      setError("Please enter a code explanation.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setStoryboard(null);
    setCurrentFrameIndex(0);
    setIsPlaying(false);

    try {
      const result = await generateStoryboard(userInput);
      setStoryboard(result);
    } catch (err) {
      console.error("Generation failed:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred while generating the animation storyboard. Make sure your API key is configured.");
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);

  const currentFrame: Frame | null = storyboard ? storyboard.frames[currentFrameIndex] : null;

  const handleNextFrame = useCallback(() => {
    if (storyboard && currentFrameIndex < storyboard.frames.length - 1) {
      setCurrentFrameIndex(prev => prev + 1);
    } else {
      setIsPlaying(false); // Stop playing at the end
    }
  }, [storyboard, currentFrameIndex]);

  const handlePrevFrame = useCallback(() => {
    if (storyboard && currentFrameIndex > 0) {
      setCurrentFrameIndex(prev => prev - 1);
    }
  }, [storyboard, currentFrameIndex]);

  const handlePlayPause = useCallback(() => {
    if (storyboard && storyboard.frames.length > 0) {
      if (!isPlaying && currentFrameIndex >= storyboard.frames.length - 1 && storyboard.frames.length > 0) { // Check storyboard.frames.length > 0 for safety
        setCurrentFrameIndex(0);
        setIsPlaying(true);
      } else {
        setIsPlaying(prev => !prev);
      }
    }
  }, [storyboard, isPlaying, currentFrameIndex]);
  
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentFrameIndex(0);

    if (storyboard) {
      // Storyboard and input remain. Errors remain.
    } else {
      setUserInput(INITIAL_EXPLANATION);
      setStoryboard(null); 
      setError(null);
      setIsLoading(false); 
    }
  }, [storyboard]); // Added storyboard as dependency

  useEffect(() => {
    let intervalId: number | undefined;
    if (isPlaying && storyboard && currentFrameIndex < storyboard.frames.length - 1) {
      intervalId = window.setInterval(() => {
        handleNextFrame();
      }, 2000); 
    } else if (isPlaying && storyboard && currentFrameIndex >= storyboard.frames.length - 1) {
        setIsPlaying(false); 
    }
    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [isPlaying, storyboard, currentFrameIndex, handleNextFrame]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTypingInInput = activeElement instanceof HTMLInputElement;
      // For textarea, we only care about Ctrl+Enter being handled by UserInput.
      // Other keys like arrows/space should work if textarea is not the one for code explanation.
      // For simplicity, if any textarea is focused, arrow keys and space might be general.
      // Let's assume UserInput's textarea is the main one to protect.
      const isTypingInCodeTextarea = activeElement === userInputRef.current;


      if (event.key === 'ArrowLeft') {
        if (!isTypingInInput && !isTypingInCodeTextarea && storyboard && storyboard.frames.length > 0) {
          event.preventDefault();
          handlePrevFrame();
        }
      } else if (event.key === 'ArrowRight') {
        if (!isTypingInInput && !isTypingInCodeTextarea && storyboard && storyboard.frames.length > 0) {
          event.preventDefault();
          handleNextFrame();
        }
      } else if (event.key === ' ') { 
        if (!isTypingInInput && !isTypingInCodeTextarea && !(activeElement instanceof HTMLButtonElement) && storyboard && storyboard.frames.length > 0) {
          event.preventDefault(); 
          handlePlayPause();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [storyboard, handlePrevFrame, handleNextFrame, handlePlayPause, userInputRef]);


  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 p-4 md:p-6 space-y-4">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-400">Code Animation Generator</h1>
        <p className="text-gray-400 mt-1">Visually understand code explanations step by step.</p>
      </header>

      <div className="flex flex-col md:flex-row flex-grow gap-4 min-h-0">
        {/* Left Pane */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col space-y-4 p-4 bg-gray-800 rounded-lg shadow-xl">
          <UserInput
            textareaRef={userInputRef} // Pass the ref
            value={userInput}
            onChange={setUserInput}
            onGenerate={handleGenerateAnimation}
            isLoading={isLoading}
            onReset={handleReset}
          />
          {error && <div className="text-red-400 bg-red-900/50 border border-red-700 p-3 rounded-md text-sm">{error}</div>}
        </div>

        {/* Right Pane */}
        <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col space-y-4 p-4 bg-gray-800 rounded-lg shadow-xl min-h-0">
          {isLoading && (
            <div className="flex-grow flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500"></div>
              <p className="ml-4 text-lg">Generating animation storyboard...</p>
            </div>
          )}
          {!isLoading && !storyboard && !error && (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714c0 .302.124.575.325.776l6.165 6.165a1.125 1.125 0 01.326.776v5.714m-6.816-18.85C13.192.44 16.528 0 20.25 0c.414 0 .75.336.75.75v21a.75.75 0 01-.75.75c-3.722 0-7.058.44-10.442 3.266a.75.75 0 01-1.066-.326L3.177 9.833a.75.75 0 01.326-1.066Z" />
              </svg>
              <p className="text-xl">Enter a code explanation and click "Generate Animation".</p>
              <p className="mt-2 text-sm">The visual storyboard will appear here.</p>
            </div>
          )}
          {storyboard && (
            <>
              <h2 className="text-2xl font-semibold text-sky-300 text-center truncate" title={storyboard.title}>{storyboard.title || "Animation Storyboard"}</h2>
              <VisualizationStage
                frame={currentFrame}
                fullCodeBlock={storyboard.full_code_block}
              />
              <AnimationControls
                currentFrame={currentFrameIndex + 1}
                totalFrames={storyboard.frames.length}
                onNext={handleNextFrame}
                onPrev={handlePrevFrame}
                onPlayPause={handlePlayPause}
                isPlaying={isPlaying}
                disableNext={storyboard.frames.length === 0 || currentFrameIndex >= storyboard.frames.length - 1}
                disablePrev={storyboard.frames.length === 0 || currentFrameIndex === 0}
              />
            </>
          )}
        </div>
      </div>
      <footer className="text-center text-xs text-gray-500 pt-4">
        Powered by Gemini API & React.
      </footer>
    </div>
  );
};

export default App;
