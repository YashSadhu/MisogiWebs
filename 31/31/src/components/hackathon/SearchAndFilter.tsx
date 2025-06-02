import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Filters) => void;
  activeFilters: Filters;
}

interface Filters {
  status: string;
  dateRange: string;
  teamSize: number;
  location: string;
  techStack: string[];
}

const SearchAndFilter = ({ onSearch, onFilterChange, activeFilters }: SearchAndFilterProps) => {
  const [showFilters, setShowFilters] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState<Filters>(activeFilters);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      status: '',
      dateRange: '',
      teamSize: 0,
      location: '',
      techStack: []
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => 
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search hackathons..."
              className="pl-9"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {Object.values(activeFilters).filter(Boolean).length}
                </Badge>
              )}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear all
                <X className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={localFilters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select
                  value={localFilters.dateRange}
                  onValueChange={(value) => handleFilterChange('dateRange', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Next Week</SelectItem>
                    <SelectItem value="month">Next Month</SelectItem>
                    <SelectItem value="quarter">Next Quarter</SelectItem>
                    <SelectItem value="year">Next Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Team Size Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Team Size</label>
                <Select
                  value={localFilters.teamSize.toString()}
                  onValueChange={(value) => handleFilterChange('teamSize', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 members</SelectItem>
                    <SelectItem value="3">3 members</SelectItem>
                    <SelectItem value="4">4 members</SelectItem>
                    <SelectItem value="5">5 members</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select
                  value={localFilters.location}
                  onValueChange={(value) => handleFilterChange('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tech Stack Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tech Stack</label>
                <Select
                  value={localFilters.techStack.join(',')}
                  onValueChange={(value) => handleFilterChange('techStack', value.split(','))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select technologies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react,node,typescript">React, Node, TypeScript</SelectItem>
                    <SelectItem value="python,django,postgresql">Python, Django, PostgreSQL</SelectItem>
                    <SelectItem value="java,spring,mysql">Java, Spring, MySQL</SelectItem>
                    <SelectItem value="ai,ml,python">AI/ML, Python</SelectItem>
                    <SelectItem value="blockchain,ethereum,solidity">Blockchain, Ethereum, Solidity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchAndFilter; 