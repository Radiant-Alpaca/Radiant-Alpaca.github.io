import React from 'react';
import { Button } from './ui/button';

interface MoodSelectorProps {
  selectedMood: number | null;
  onSelectMood: (mood: number) => void;
}

const moods = [
  { emoji: '😢', label: 'Very Sad', value: 1 },
  { emoji: '😕', label: 'Sad', value: 2 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '😊', label: 'Happy', value: 4 },
  { emoji: '😄', label: 'Very Happy', value: 5 }
];

export default function MoodSelector({ selectedMood, onSelectMood }: MoodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {moods.map((mood) => (
        <Button
          key={mood.value}
          variant={selectedMood === mood.value ? 'default' : 'outline'}
          onClick={() => onSelectMood(mood.value)}
          className={`flex flex-col items-center gap-2 p-4 h-auto transition-all duration-300 hover:scale-105 ${
            selectedMood === mood.value 
              ? 'bg-blue-500 text-white border-blue-500 shadow-lg' 
              : 'bg-white border-gray-300 hover:border-blue-400'
          }`}
        >
          <span className="text-2xl">{mood.emoji}</span>
          <span className="figma-hand-regular text-sm">{mood.label}</span>
        </Button>
      ))}
    </div>
  );
}