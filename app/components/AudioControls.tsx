interface AudioControlsProps {
    audioSrc: string | null;
    isPlaying: boolean;
    isAudioLoading: boolean;
    onFetchAudio: () => void;
    onPlayAudio: () => void;
    onPauseAudio: () => void;
  }
  
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
        {!audioSrc ? (
          <button
            onClick={onFetchAudio}
            disabled={isAudioLoading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {isAudioLoading ? 'Fetching...' : 'Fetch Audio'}
          </button>
        ) : (
          <button
            onClick={isPlaying ? onPauseAudio : onPlayAudio}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        )}
      </div>
    );
  };
  
  export default AudioControls;