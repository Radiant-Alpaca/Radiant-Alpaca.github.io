import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Download, Upload, Save, Trash2, History, Database, ChevronDown, ChevronUp } from 'lucide-react';

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

interface DataManagerProps {
  currentData: PlannerData;
  onDataImport: (data: PlannerData) => void;
  onShowHistory: () => void;
}

export default function DataManager({ currentData, onDataImport, onShowHistory }: DataManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Save current day's data to history
  const saveToHistory = () => {
    const history = JSON.parse(localStorage.getItem('plannerHistory') || '[]');
    const existingIndex = history.findIndex((entry: PlannerData) => entry.date === currentData.date);
    
    if (existingIndex >= 0) {
      history[existingIndex] = currentData;
    } else {
      history.push(currentData);
    }
    
    // Keep only last 30 days
    if (history.length > 30) {
      history.splice(0, history.length - 30);
    }
    
    localStorage.setItem('plannerHistory', JSON.stringify(history));
    
    // Show success message
    const button = document.activeElement as HTMLButtonElement;
    const originalText = button.textContent;
    button.textContent = 'Saved!';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 1500);
  };

  // Export data as JSON
  const exportData = () => {
    const history = JSON.parse(localStorage.getItem('plannerHistory') || '[]');
    const dataToExport = {
      currentData,
      history,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-planner-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export data as CSV
  const exportCSV = () => {
    const history = JSON.parse(localStorage.getItem('plannerHistory') || '[]');
    const allData = [currentData, ...history];
    
    const csvHeaders = [
      'Date', 'Water Glasses', 'Inspiring Word', 'Priority 1', 'Priority 2', 'Priority 3',
      'Tasks', 'Notes', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Mood', 'Wins'
    ];
    
    const csvRows = allData.map((data: PlannerData) => [
      data.date,
      data.waterGlasses.filter(Boolean).length,
      data.inspiringWord,
      data.priorities[0] || '',
      data.priorities[1] || '',
      data.priorities[2] || '',
      data.tasks.filter(task => task.text.trim()).map(task => `${task.text} [${task.category || 'none'}]`).join('; '),
      data.notes,
      data.meals.breakfast.join('; '),
      data.meals.lunch.join('; '),
      data.meals.dinner.join('; '),
      data.meals.snacks.join('; '),
      data.mood || '',
      data.wins
    ]);
    
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-planner-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import data from JSON file
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        if (importedData.currentData) {
          onDataImport(importedData.currentData);
        }
        
        if (importedData.history) {
          localStorage.setItem('plannerHistory', JSON.stringify(importedData.history));
        }
        
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  // Clear all data
  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('plannerHistory');
      localStorage.removeItem('dailyPlannerData');
      alert('All data cleared!');
    }
  };

  return (
    <div className="space-y-3">
      {/* Quick Actions - Always Visible */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={saveToHistory}
          className="flex-1 figma-hand-bold text-sm"
          variant="default"
          size="sm"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Today
        </Button>
        
        <Button
          onClick={onShowHistory}
          className="flex-1 figma-hand-bold text-sm"
          variant="outline"
          size="sm"
        >
          <History className="w-4 h-4 mr-2" />
          History
        </Button>
      </div>

      {/* Expandable Advanced Options */}
      <div className="border rounded-lg">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          className="w-full justify-between figma-hand-bold text-sm p-3"
        >
          <span className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Advanced Options
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
        
        {isExpanded && (
          <div className="p-3 border-t space-y-3">
            {/* Export Options */}
            <div>
              <label className="figma-hand-bold text-xs block mb-2 text-muted-foreground">Export:</label>
              <div className="flex gap-2">
                <Button
                  onClick={exportData}
                  className="flex-1 figma-hand-bold text-xs"
                  variant="secondary"
                  size="sm"
                >
                  <Download className="w-3 h-3 mr-1" />
                  JSON
                </Button>
                <Button
                  onClick={exportCSV}
                  className="flex-1 figma-hand-bold text-xs"
                  variant="secondary"
                  size="sm"
                >
                  <Download className="w-3 h-3 mr-1" />
                  CSV
                </Button>
              </div>
            </div>

            {/* Import */}
            <div>
              <label className="figma-hand-bold text-xs block mb-2 text-muted-foreground">Import:</label>
              <Input
                type="file"
                accept=".json"
                onChange={importData}
                className="figma-hand-regular text-xs h-8"
                size="sm"
              />
            </div>

            {/* Clear Data */}
            <Button
              onClick={clearAllData}
              className="w-full figma-hand-bold text-xs"
              variant="destructive"
              size="sm"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear All Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}