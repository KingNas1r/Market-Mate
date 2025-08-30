import { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
  placeholder?: string;
}

const languages = [
  { code: 'en-NG', name: 'English (Nigeria)' },
  { code: 'yo-NG', name: 'Yoruba' },
  { code: 'en-GB', name: 'Pidgin English' }, // Using British English as fallback for Pidgin
];

export function VoiceInput({ onTranscript, className, placeholder }: VoiceInputProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en-NG');
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    error,
  } = useSpeechRecognition();

  const handleStartListening = () => {
    resetTranscript();
    startListening({ language: selectedLanguage });
  };

  const handleStopListening = () => {
    stopListening();
    if (transcript.trim()) {
      onTranscript(transcript.trim());
    }
  };

  const handleClearTranscript = () => {
    resetTranscript();
  };

  if (!isSupported) {
    return (
      <div className={cn("text-sm text-gray-500", className)}>
        Voice input not supported in this browser
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-36 h-8 text-xs bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          type="button"
          variant={isListening ? "destructive" : "default"}
          size="sm"
          onClick={isListening ? handleStopListening : handleStartListening}
          className="flex items-center space-x-1 h-8"
        >
          {isListening ? (
            <>
              <MicOff size={14} />
              <span className="text-xs">Stop</span>
            </>
          ) : (
            <>
              <Mic size={14} />
              <span className="text-xs">Speak</span>
            </>
          )}
        </Button>

        {transcript && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearTranscript}
            className="text-gray-500 h-8"
          >
            <span className="text-xs">Clear</span>
          </Button>
        )}
      </div>

      {isListening && (
        <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded-md border border-green-200">
          <Volume2 size={16} className="animate-pulse" />
          <span>Listening in {languages.find(l => l.code === selectedLanguage)?.name}... Speak now</span>
        </div>
      )}

      {transcript && (
        <div className="p-3 bg-gray-50 border rounded-md">
          <p className="text-sm text-gray-700 font-medium">Voice Input:</p>
          <p className="text-sm text-gray-600 mt-1">{transcript}</p>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      {placeholder && !transcript && !isListening && (
        <p className="text-sm text-gray-500">{placeholder}</p>
      )}
    </div>
  );
}