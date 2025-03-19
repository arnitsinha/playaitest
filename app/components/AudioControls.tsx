// Define the interface for the AudioControls component props
interface AudioControlsProps {
  audioSrc: string | null; // URL of the audio file (null if no audio is loaded)
  isPlaying: boolean; // Whether the audio is currently playing
  isAudioLoading: boolean; // Whether the audio is being fetched or generated
  onFetchAudio: () => void; // Callback function to fetch/generate audio
  onPlayAudio: () => void; // Callback function to play audio
  onPauseAudio: () => void; // Callback function to pause audio
}

// Main AudioControls component
const AudioControls: React.FC<AudioControlsProps> = ({
  audioSrc,
  isPlaying,
  isAudioLoading,
  onFetchAudio,
  onPlayAudio,
  onPauseAudio,
}) => {
  return (
    <div className="flex items-center justify-center p-4 border-t border-gray-200 bg-gray-50">
      {/* If no audio is loaded, show the "Fetch Audio" button */}
      {!audioSrc ? (
        <button
          onClick={onFetchAudio} // Trigger the fetch audio callback
          disabled={isAudioLoading} // Disable the button while audio is being fetched
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {isAudioLoading ? 'Fetching...' : 'Fetch Audio'} {/* Show loading state if applicable */}
        </button>
      ) : (
        // If audio is loaded, show the "Play" or "Pause" button
        <button
          onClick={isPlaying ? onPauseAudio : onPlayAudio} // Toggle between play and pause
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          {isPlaying ? 'Pause' : 'Play'} {/* Show "Pause" if playing, otherwise "Play" */}
        </button>
      )}
    </div>
  );
};

export default AudioControls;