import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import WaterTracker from './WaterTracker';
import TaskList from './TaskList';

interface DailyDashboardProps {
  data: any;
  updateData: (data: any) => void;
  onCopyTasks: () => void;
}

export default function DailyDashboard({ data, updateData, onCopyTasks }: DailyDashboardProps) {
  const updateInspiringWord = (value: string) => {
    updateData({ ...data, inspiringWord: value });
  };

  const updatePriority = (index: number, value: string) => {
    const newPriorities = [...data.priorities];
    newPriorities[index] = value;
    updateData({ ...data, priorities: newPriorities });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left Half - Mint to Pale Pink Gradient */}
      <div 
        className="rounded-lg p-6 min-h-[600px]"
        style={{ 
          background: 'linear-gradient(135deg, #A0F0E6 0%, #F4C4C4 100%)' 
        }}
      >
        {/* Header with Date */}
        <div className="mb-6">
          <h1 className="figma-hand-bold text-2xl text-center text-gray-800">
            {data.date}
          </h1>
        </div>

        {/* Water Tracker */}
        <div className="mb-6">
          <WaterTracker 
            glasses={data.waterGlasses}
            onToggle={(index) => {
              const newGlasses = [...data.waterGlasses];
              newGlasses[index] = !newGlasses[index];
              updateData({ ...data, waterGlasses: newGlasses });
            }}
          />
        </div>

        {/* Inspiring Word */}
        <div className="mb-6">
          <Input
            value={data.inspiringWord}
            onChange={(e) => updateInspiringWord(e.target.value)}
            placeholder="Today's inspiring word..."
            className="figma-hand-bold text-center text-2xl bg-white/30 border-none placeholder:text-gray-600/70 text-gray-800"
          />
        </div>

        {/* Top 3 Priorities */}
        <div className="space-y-3">
          <h3 className="figma-hand-bold text-lg text-gray-800 mb-3">Top 3 Priorities</h3>
          {data.priorities.map((priority: string, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <span className="figma-hand-bold text-lg text-gray-800 w-6">
                {index + 1}.
              </span>
              <Input
                value={priority}
                onChange={(e) => updatePriority(index, e.target.value)}
                placeholder={`Priority ${index + 1}...`}
                className="figma-hand-bold text-lg bg-white/30 border-none border-b-2 border-gray-400/50 rounded-none placeholder:text-gray-600/70 text-gray-800"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Half - Coral to Peach Gradient */}
      <div 
        className="rounded-lg p-6 min-h-[600px]"
        style={{ 
          background: 'linear-gradient(135deg, #FF8A8A 0%, #FFC6C6 100%)' 
        }}
      >
        {/* Task List */}
        <div className="h-full flex flex-col">
          <h3 className="figma-hand-bold text-lg text-gray-800 mb-4">Today's Tasks</h3>
          
          <div className="flex-1 mb-4">
            <TaskList 
              tasks={data.tasks}
              onUpdateTasks={(tasks) => updateData({ ...data, tasks })}
            />
          </div>

          {/* Copy Tasks Button */}
          <Button
            onClick={onCopyTasks}
            className="figma-hand-bold text-base w-full"
            style={{ 
              backgroundColor: '#FF8A8A',
              color: 'white',
              border: 'none'
            }}
          >
            Copy Tasks
          </Button>
        </div>
      </div>
    </div>
  );
}