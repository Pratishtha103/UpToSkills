import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Company_Dashboard/ui/select';
import { Button } from '../Company_Dashboard/ui/button';
import { Filter, RotateCcw } from 'lucide-react';

const domains = [
  'All Domains',
  'Web Development',
  'AI/ML',
  'Data Science',
  'Mobile Development',
  'DevOps',
  'UI/UX Design',
  'Cybersecurity',
  'Cloud Computing',
  'Blockchain',
  'Game Development',
  'Other'
];

export default function SearchFilters({
  filters,
  onFilterChange,
  onClearFilters,
  nameSuggestions = [],
  showNameSuggestions = false,
  onNameFocus,
  onNameBlur,
  onNameSuggestionSelect,
}) {
  return (
    <motion.div
      className="bg-card border border-border rounded-lg p-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Filter Students</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className='flex items-center gap-2 relative'>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Name:
          </label>
          <input
            type="text"
            value={filters.name}
            onChange={(e) => onFilterChange('name', e.target.value)}
            onFocus={onNameFocus}
            onBlur={onNameBlur}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter name"
          />
          {showNameSuggestions && nameSuggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-full bg-background border border-border rounded-md shadow-lg max-h-56 overflow-auto z-20">
              {nameSuggestions.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onNameSuggestionSelect?.(suggestion);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className='flex items-center gap-2'>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Domain:
          </label>
          <Select value={filters.domain} onValueChange={(value) => onFilterChange('domain', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              {domains.map((domain) => (
                <SelectItem key={domain} value={domain}>
                  {domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
