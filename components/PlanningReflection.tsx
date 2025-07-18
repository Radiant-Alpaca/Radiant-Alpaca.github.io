import React from 'react';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import MoodSelector from './MoodSelector';

interface PlanningReflectionProps {
  data: any;
  updateData: (data: any) => void;
}

export default function PlanningReflection({ data, updateData }: PlanningReflectionProps) {
  const updateNotes = (value: string) => {
    updateData({ ...data, notes: value });
  };

  const updateMeal = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', index: number, value: string) => {
    const newMeals = { ...data.meals };
    newMeals[mealType][index] = value;
    updateData({ ...data, meals: newMeals });
  };

  const updateWins = (value: string) => {
    updateData({ ...data, wins: value });
  };

  return (
    <div className="bg-white rounded-lg p-6 space-y-8">
      {/* Notes & Upcoming */}
      <div>
        <h2 className="figma-hand-bold text-xl mb-4">Notes & Upcoming</h2>
        <Textarea
          value={data.notes}
          onChange={(e) => updateNotes(e.target.value)}
          placeholder="Write your thoughts, upcoming events, or anything else you want to remember..."
          className="figma-hand-regular text-sm min-h-32 italic"
        />
      </div>

      {/* Meals & Snacks */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="figma-hand-bold text-xl mb-4">Meals & Snacks</h2>
          
          {/* Breakfast */}
          <div className="mb-4">
            <h3 className="figma-hand-bold text-lg mb-2">Breakfast</h3>
            {data.meals.breakfast.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <span className="text-gray-600">•</span>
                <Input
                  value={item}
                  onChange={(e) => updateMeal('breakfast', index, e.target.value)}
                  placeholder="Breakfast item..."
                  className="figma-hand-regular text-sm"
                />
              </div>
            ))}
          </div>

          {/* Lunch */}
          <div className="mb-4">
            <h3 className="figma-hand-bold text-lg mb-2">Lunch</h3>
            {data.meals.lunch.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <span className="text-gray-600">•</span>
                <Input
                  value={item}
                  onChange={(e) => updateMeal('lunch', index, e.target.value)}
                  placeholder="Lunch item..."
                  className="figma-hand-regular text-sm"
                />
              </div>
            ))}
          </div>

          {/* Dinner */}
          <div className="mb-4">
            <h3 className="figma-hand-bold text-lg mb-2">Dinner</h3>
            {data.meals.dinner.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <span className="text-gray-600">•</span>
                <Input
                  value={item}
                  onChange={(e) => updateMeal('dinner', index, e.target.value)}
                  placeholder="Dinner item..."
                  className="figma-hand-regular text-sm"
                />
              </div>
            ))}
          </div>

          {/* Snacks */}
          <div>
            <h3 className="figma-hand-bold text-lg mb-2">Snacks</h3>
            {data.meals.snacks.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <span className="text-gray-600">•</span>
                <Input
                  value={item}
                  onChange={(e) => updateMeal('snacks', index, e.target.value)}
                  placeholder="Snack item..."
                  className="figma-hand-regular text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Mood Selector */}
          <div className="mb-6">
            <h3 className="figma-hand-bold text-lg mb-3">How are you feeling today?</h3>
            <MoodSelector
              selectedMood={data.mood}
              onSelectMood={(mood) => updateData({ ...data, mood })}
            />
          </div>

          {/* Day's Wins */}
          <div>
            <h3 className="figma-hand-bold text-lg mb-3">Day's Wins</h3>
            <Textarea
              value={data.wins}
              onChange={(e) => updateWins(e.target.value)}
              placeholder="What went well today? What are you proud of?"
              className="figma-hand-italic text-base min-h-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}