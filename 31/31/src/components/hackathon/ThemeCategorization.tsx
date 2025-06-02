import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

interface ThemeCategorizationProps {
  themes: Theme[];
  selectedTheme: string | null;
  onThemeSelect: (themeId: string) => void;
  onSearch: (query: string) => void;
}

const ThemeCategorization = ({
  themes,
  selectedTheme,
  onThemeSelect,
  onSearch
}: ThemeCategorizationProps) => {
  const themeIcons: Record<string, string> = {
    web: '🌐',
    mobile: '📱',
    ai: '🤖',
    blockchain: '⛓️',
    iot: '🔌',
    security: '🔒',
    gaming: '🎮',
    data: '📊',
    cloud: '☁️',
    devops: '🔄'
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hackathon Themes</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search themes..."
            className="pl-8"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedTheme === theme.id
                    ? 'bg-purple-50 border border-purple-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onThemeSelect(theme.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{themeIcons[theme.id] || '🎯'}</span>
                    <div>
                      <h3 className="font-medium">{theme.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{theme.description}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {theme.count}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ThemeCategorization; 