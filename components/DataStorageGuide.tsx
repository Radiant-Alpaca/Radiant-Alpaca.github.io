import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ExternalLink, Database, Cloud, HardDrive, GitBranch, Server } from 'lucide-react';

interface StorageOption {
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: React.ReactNode;
  pros: string[];
  cons: string[];
  setup: string[];
  link?: string;
}

const storageOptions: StorageOption[] = [
  {
    name: 'Local Storage + Export/Import',
    description: 'Built-in browser storage with backup capabilities',
    difficulty: 'Easy',
    icon: <HardDrive className="w-5 h-5" />,
    pros: [
      'No setup required',
      'Works offline',
      'Complete privacy',
      'Export/import functionality'
    ],
    cons: [
      'Limited to one device',
      'Can be cleared by browser',
      'No real-time sync'
    ],
    setup: [
      'Already implemented in this app',
      'Use "Data Manager" to export/import',
      'Regular backups recommended'
    ]
  },
  {
    name: 'PocketBase',
    description: 'Single-file backend with real-time database',
    difficulty: 'Easy',
    icon: <Database className="w-5 h-5" />,
    pros: [
      'Single binary file',
      'Real-time sync',
      'Built-in auth',
      'SQLite database'
    ],
    cons: [
      'Requires server hosting',
      'Single point of failure'
    ],
    setup: [
      'Download PocketBase binary',
      'Run: ./pocketbase serve',
      'Configure collections via admin UI',
      'Connect with JavaScript SDK'
    ],
    link: 'https://pocketbase.io/'
  },
  {
    name: 'Supabase (Self-hosted)',
    description: 'Open source Firebase alternative',
    difficulty: 'Medium',
    icon: <Cloud className="w-5 h-5" />,
    pros: [
      'PostgreSQL database',
      'Real-time subscriptions',
      'Built-in auth',
      'REST & GraphQL APIs'
    ],
    cons: [
      'Requires Docker',
      'More complex setup',
      'Resource intensive'
    ],
    setup: [
      'Clone Supabase repo',
      'Run: docker-compose up',
      'Configure environment',
      'Use Supabase JavaScript client'
    ],
    link: 'https://supabase.com/docs/guides/self-hosting'
  },
  {
    name: 'Git-based Storage',
    description: 'Version-controlled JSON files in Git repository',
    difficulty: 'Easy',
    icon: <GitBranch className="w-5 h-5" />,
    pros: [
      'Version history',
      'Free (GitHub/GitLab)',
      'Excellent backup',
      'Merge conflicts handling'
    ],
    cons: [
      'Manual sync process',
      'Not real-time',
      'Requires Git knowledge'
    ],
    setup: [
      'Create private repository',
      'Export data as JSON',
      'Commit and push regularly',
      'Use GitHub API for automation'
    ],
    link: 'https://docs.github.com/en/rest'
  },
  {
    name: 'Appwrite',
    description: 'Self-hosted backend-as-a-service',
    difficulty: 'Medium',
    icon: <Server className="w-5 h-5" />,
    pros: [
      'Docker-based',
      'Multiple databases',
      'Real-time sync',
      'Built-in auth'
    ],
    cons: [
      'Requires Docker',
      'Complex configuration',
      'Resource intensive'
    ],
    setup: [
      'Install Docker',
      'Run Appwrite installer',
      'Configure database',
      'Use Appwrite SDK'
    ],
    link: 'https://appwrite.io/'
  },
  {
    name: 'Firebase (Free tier)',
    description: 'Google\'s backend service with generous free tier',
    difficulty: 'Easy',
    icon: <Cloud className="w-5 h-5" />,
    pros: [
      'No server maintenance',
      'Real-time sync',
      'Generous free tier',
      'Easy setup'
    ],
    cons: [
      'Google dependency',
      'Vendor lock-in',
      'Pricing after free tier'
    ],
    setup: [
      'Create Firebase project',
      'Enable Firestore',
      'Configure authentication',
      'Use Firebase SDK'
    ],
    link: 'https://firebase.google.com/'
  }
];

export default function DataStorageGuide() {
  const [selectedOption, setSelectedOption] = useState<StorageOption | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="figma-hand-bold text-sm"
      >
        <Database className="w-4 h-4 mr-2" />
        Storage Options
      </Button>
    );
  }

  if (selectedOption) {
    return (
      <Card className="w-full max-w-2xl mx-auto max-h-96 overflow-y-auto">
        <CardHeader>
          <CardTitle className="figma-hand-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedOption.icon}
              {selectedOption.name}
            </div>
            <div className="flex gap-2">
              {selectedOption.link && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(selectedOption.link, '_blank')}
                  className="figma-hand-bold text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedOption(null)}
              >
                ←
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(selectedOption.difficulty)}>
              {selectedOption.difficulty}
            </Badge>
          </div>
          
          <p className="figma-hand-regular text-sm text-muted-foreground">
            {selectedOption.description}
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="figma-hand-bold text-sm mb-2 text-green-700">✓ Pros</h4>
              <ul className="space-y-1">
                {selectedOption.pros.map((pro, index) => (
                  <li key={index} className="figma-hand-regular text-sm text-muted-foreground">
                    • {pro}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="figma-hand-bold text-sm mb-2 text-red-700">✗ Cons</h4>
              <ul className="space-y-1">
                {selectedOption.cons.map((con, index) => (
                  <li key={index} className="figma-hand-regular text-sm text-muted-foreground">
                    • {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="figma-hand-bold text-sm mb-2">Setup Steps</h4>
            <ol className="space-y-1">
              {selectedOption.setup.map((step, index) => (
                <li key={index} className="figma-hand-regular text-sm text-muted-foreground">
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto max-h-96 overflow-y-auto">
      <CardHeader>
        <CardTitle className="figma-hand-bold flex items-center justify-between">
          <span>Open Source Data Storage Options</span>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {storageOptions.map((option, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => setSelectedOption(option)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="figma-hand-bold text-sm">{option.name}</h3>
                    <Badge className={getDifficultyColor(option.difficulty)}>
                      {option.difficulty}
                    </Badge>
                  </div>
                  <p className="figma-hand-regular text-xs text-muted-foreground line-clamp-2">
                    {option.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="figma-hand-bold text-sm mb-2">💡 Recommendation</h3>
          <p className="figma-hand-regular text-sm text-muted-foreground">
            For hassle-free daily note-taking, start with the built-in <strong>Local Storage + Export/Import</strong> solution. 
            If you need cross-device sync, <strong>PocketBase</strong> offers the easiest self-hosted setup.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}