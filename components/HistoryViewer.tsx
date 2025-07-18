import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Eye, RotateCcw, X } from 'lucide-react';

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

interface HistoryViewerProps {
  onClose: () => void;
  onRestoreData: (data: PlannerData) => void;
}

export default function HistoryViewer({ onClose, onRestoreData }: HistoryViewerProps) {
  const [history, setHistory] = useState<PlannerData[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<PlannerData | null>(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('plannerHistory') || '[]');
    // Sort by date (newest first)
    const sortedHistory = savedHistory.sort((a: PlannerData, b: PlannerData) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setHistory(sortedHistory);
  }, []);

  const getMoodEmoji = (mood: number | null) => {
    const moodMap = {
      1: '😢',
      2: '😕',
      3: '😐',
      4: '😊',
      5: '😄'
    };
    return mood ? moodMap[mood as keyof typeof moodMap] : '—';
  };

  const getCompletedTasksCount = (tasks: PlannerData['tasks']) => {
    return tasks.filter(task => task.completed && task.text.trim()).length;
  };

  const getTotalTasksCount = (tasks: PlannerData['tasks']) => {
    return tasks.filter(task => task.text.trim()).length;
  };

  const restoreEntry = (entry: PlannerData) => {
    if (confirm(`Restore data from ${entry.date}? This will overwrite current data.`)) {
      onRestoreData(entry);
      onClose();
    }
  };

  if (selectedEntry) {
    return (
      <Card className="w-full max-w-2xl mx-auto max-h-96 overflow-y-auto">
        <CardHeader>
          <CardTitle className="figma-hand-bold flex items-center justify-between">
            <span>{selectedEntry.date}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => restoreEntry(selectedEntry)}
                className="figma-hand-bold text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedEntry(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="figma-hand-bold text-sm">Water: {selectedEntry.waterGlasses.filter(Boolean).length}/8</div>
              <div className="figma-hand-bold text-sm">Mood: {getMoodEmoji(selectedEntry.mood)}</div>
              <div className="figma-hand-bold text-sm">
                Tasks: {getCompletedTasksCount(selectedEntry.tasks)}/{getTotalTasksCount(selectedEntry.tasks)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="figma-hand-bold text-sm">Inspiring Word:</div>
              <div className="figma-hand-regular text-sm text-muted-foreground">
                {selectedEntry.inspiringWord || 'None'}
              </div>
            </div>
          </div>

          {/* Priorities */}
          <div>
            <div className="figma-hand-bold text-sm mb-2">Priorities:</div>
            <div className="space-y-1">
              {selectedEntry.priorities.map((priority, index) => (
                priority.trim() && (
                  <div key={index} className="figma-hand-regular text-sm">
                    {index + 1}. {priority}
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div>
            <div className="figma-hand-bold text-sm mb-2">Tasks:</div>
            <div className="space-y-1">
              {selectedEntry.tasks.filter(task => task.text.trim()).map((task, index) => (
                <div key={task.id} className="flex items-center gap-2 figma-hand-regular text-sm">
                  <span>{task.completed ? '✓' : '○'}</span>
                  <span>{task.text}</span>
                  {task.category && (
                    <Badge variant="outline" className="text-xs">
                      {task.category}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {selectedEntry.notes && (
            <div>
              <div className="figma-hand-bold text-sm mb-2">Notes:</div>
              <div className="figma-hand-regular text-sm text-muted-foreground bg-muted p-2 rounded">
                {selectedEntry.notes}
              </div>
            </div>
          )}

          {/* Wins */}
          {selectedEntry.wins && (
            <div>
              <div className="figma-hand-bold text-sm mb-2">Wins:</div>
              <div className="figma-hand-italic text-sm text-muted-foreground bg-muted p-2 rounded">
                {selectedEntry.wins}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto max-h-96 overflow-y-auto">
      <CardHeader>
        <CardTitle className="figma-hand-bold flex items-center justify-between">
          <span>History ({history.length} entries)</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <div className="figma-hand-regular text-muted-foreground">
              No history found. Start by saving your daily data!
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelectedEntry(entry)}
              >
                <div className="flex-1">
                  <div className="figma-hand-bold text-sm">{entry.date}</div>
                  <div className="figma-hand-regular text-xs text-muted-foreground mt-1">
                    Water: {entry.waterGlasses.filter(Boolean).length}/8 • 
                    Tasks: {getCompletedTasksCount(entry.tasks)}/{getTotalTasksCount(entry.tasks)} • 
                    Mood: {getMoodEmoji(entry.mood)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEntry(entry);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      restoreEntry(entry);
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}