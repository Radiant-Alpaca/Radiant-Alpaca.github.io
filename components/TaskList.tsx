import React from 'react';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: 'work' | 'personal' | null;
}

interface TaskListProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
}

export default function TaskList({ tasks, onUpdateTasks }: TaskListProps) {
  const updateTask = (index: number, updates: Partial<Task>) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], ...updates };
    onUpdateTasks(newTasks);
  };

  const toggleCategory = (index: number, category: 'work' | 'personal') => {
    const currentCategory = tasks[index].category;
    const newCategory = currentCategory === category ? null : category;
    updateTask(index, { category: newCategory });
  };

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {tasks.map((task, index) => (
        <div key={task.id} className="flex items-center gap-3 bg-white/20 rounded-lg p-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => 
              updateTask(index, { completed: checked as boolean })
            }
            className="border-white"
          />
          
          <Input
            value={task.text}
            onChange={(e) => updateTask(index, { text: e.target.value })}
            placeholder={`Task ${index + 1}...`}
            className="flex-1 bg-transparent border-none figma-hand-regular text-base placeholder:text-gray-600/70 text-gray-800"
          />
          
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={task.category === 'work' ? 'default' : 'outline'}
              onClick={() => toggleCategory(index, 'work')}
              className={`figma-hand-regular text-sm px-3 py-1 transition-all duration-200 ${
                task.category === 'work'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white/50 text-gray-700 border-orange-500/50 hover:bg-orange-500/20'
              }`}
            >
              Work
            </Button>
            
            <Button
              size="sm"
              variant={task.category === 'personal' ? 'default' : 'outline'}
              onClick={() => toggleCategory(index, 'personal')}
              className={`figma-hand-regular text-sm px-3 py-1 transition-all duration-200 ${
                task.category === 'personal'
                  ? 'bg-teal-500 text-white border-teal-500'
                  : 'bg-white/50 text-gray-700 border-teal-500/50 hover:bg-teal-500/20'
              }`}
            >
              Personal
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}