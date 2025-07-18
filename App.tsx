import React, { useState, useEffect } from 'react';
import DailyDashboard from './components/DailyDashboard';
import PlanningReflection from './components/PlanningReflection';
import DataManager from './components/DataManager';
import HistoryViewer from './components/HistoryViewer';
import DataStorageGuide from './components/DataStorageGuide';
import { Button } from './components/ui/button';

interface PlannerData {
  date: string;
  waterGlasses: boolean[];
  inspiringWord: string;
  priorities: string[];
  tasks: Array<{
    id: string;
    text: string;
    completed: boolean;
    category: 'work' | 'personal' | null;
  }>;
  notes: string;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  mood: number | null;
  wins: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'page1' | 'page2'>('page1');
  const [showHistory, setShowHistory] = useState(false);
  const [showStorageGuide, setShowStorageGuide] = useState(false);
  const [plannerData, setPlannerData] = useState<PlannerData>({
    date: new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    waterGlasses: new Array(8).fill(false),
    inspiringWord: '',
    priorities: ['', '', ''],
    tasks: Array.from({ length: 10 }, (_, i) => ({
      id: `task-${i}`,
      text: '',
      completed: false,
      category: null
    })),
    notes: '',
    meals: {
      breakfast: ['', '', ''],
      lunch: ['', '', ''],
      dinner: ['', '', ''],
      snacks: ['', '']
    },
    mood: null,
    wins: ''
  });

  // Auto-save to localStorage
  useEffect(() => {
    const saveData = () => {
      localStorage.setItem('dailyPlannerData', JSON.stringify(plannerData));
    };
    
    saveData();
    const interval = setInterval(saveData, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(interval);
  }, [plannerData]);

  // Load data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('dailyPlannerData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Only load if it's from today
        const today = new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        if (parsed.date === today) {
          setPlannerData(parsed);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const duplicateForTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setPlannerData({
      ...plannerData,
      date: tomorrow.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      waterGlasses: new Array(8).fill(false),
      inspiringWord: '',
      priorities: ['', '', ''],
      tasks: plannerData.tasks.map(task => ({
        ...task,
        text: '',
        completed: false,
        category: null
      })),
      notes: '',
      meals: {
        breakfast: ['', '', ''],
        lunch: ['', '', ''],
        dinner: ['', '', ''],
        snacks: ['', '']
      },
      mood: null,
      wins: ''
    });
    setCurrentPage('page1');
  };

  const copyTasks = () => {
    const tasksText = plannerData.tasks
      .filter(task => task.text.trim())
      .map(task => `${task.completed ? '✓' : '○'} ${task.text} ${task.category ? `[${task.category}]` : ''}`)
      .join('\n');
    
    navigator.clipboard.writeText(tasksText).catch(() => {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = tasksText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  const handleDataImport = (importedData: PlannerData) => {
    setPlannerData(importedData);
  };

  const handleRestoreData = (restoredData: PlannerData) => {
    setPlannerData(restoredData);
  };

  if (showHistory) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <HistoryViewer 
            onClose={() => setShowHistory(false)}
            onRestoreData={handleRestoreData}
          />
        </div>
      </div>
    );
  }

  if (showStorageGuide) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => setShowStorageGuide(false)}
              className="figma-hand-bold text-sm"
            >
              ← Back to Planner
            </Button>
          </div>
          <DataStorageGuide />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Layout with Sidebar */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Main Content Area */}
        <div className="flex-1 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Clean Navigation - Only Essential Actions */}
            <div className="mb-6 flex flex-wrap gap-2 justify-center">
              <Button
                variant={currentPage === 'page1' ? 'default' : 'outline'}
                onClick={() => setCurrentPage('page1')}
                className="figma-hand-bold text-base"
              >
                Page 1
              </Button>
              <Button
                variant={currentPage === 'page2' ? 'default' : 'outline'}
                onClick={() => setCurrentPage('page2')}
                className="figma-hand-bold text-base"
              >
                Page 2
              </Button>
              <Button
                variant="secondary"
                onClick={duplicateForTomorrow}
                className="figma-hand-bold text-base"
              >
                Duplicate for Tomorrow
              </Button>
            </div>

            {/* Page Content */}
            <div className="transition-all duration-300 ease-in-out">
              {currentPage === 'page1' ? (
                <DailyDashboard 
                  data={plannerData} 
                  updateData={setPlannerData}
                  onCopyTasks={copyTasks}
                />
              ) : (
                <PlanningReflection 
                  data={plannerData} 
                  updateData={setPlannerData}
                />
              )}
            </div>
          </div>
        </div>

        {/* Lean Sidebar for Data Management - Desktop */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="figma-hand-bold text-lg mb-3">Data & Storage</h3>
              <DataManager 
                currentData={plannerData}
                onDataImport={handleDataImport}
                onShowHistory={() => setShowHistory(true)}
              />
            </div>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => setShowStorageGuide(true)}
                className="w-full figma-hand-bold text-sm justify-start"
                size="sm"
              >
                Storage Options Guide
              </Button>
              
              <div className="text-xs text-muted-foreground figma-hand-regular p-2 bg-gray-50 rounded">
                <p className="mb-2">💡 <strong>Quick Tips:</strong></p>
                <ul className="space-y-1 text-xs">
                  <li>• Data auto-saves every 30 seconds</li>
                  <li>• Export regularly for backup</li>
                  <li>• Use history to restore old entries</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar for Data Management - Mobile */}
        <div className="lg:hidden bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="figma-hand-bold text-base">Data & Storage</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowStorageGuide(true)}
                  className="figma-hand-bold text-sm"
                  size="sm"
                >
                  Storage Guide
                </Button>
              </div>
              
              <DataManager 
                currentData={plannerData}
                onDataImport={handleDataImport}
                onShowHistory={() => setShowHistory(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}