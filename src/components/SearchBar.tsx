
import React, { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, ChevronDown } from "lucide-react";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Department } from '@/types/directory';
import { TagType } from '@/types/search';

interface SearchBarProps {
  onSearch: (query: string, tags?: TagType[]) => void;
  initialQuery?: string;
  departments: Department[];
  tags: TagType[];
  onAddTag: (tag: TagType) => void;
  onRemoveTag: (index: number) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  initialQuery = '', 
  departments,
  tags,
  onAddTag,
  onRemoveTag
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState('');
  const [filterType, setFilterType] = useState<'department' | 'category' | 'subcategory'>('department');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  // Get filtered suggestions based on current tags and input
  const getSuggestions = () => {
    const suggestions: TagType[] = [];
    const existingDepartmentIds = new Set(tags.filter(t => t.type === 'department').map(t => t.id));
    const existingCategoryIds = new Set(tags.filter(t => t.type === 'category').map(t => t.id));
    const existingSubcategoryIds = new Set(tags.filter(t => t.type === 'subcategory').map(t => t.id));
    
    // Filter departments
    if (filterType === 'department') {
      departments.forEach(dept => {
        if (!existingDepartmentIds.has(dept.id) && 
            (dept.name.toLowerCase().includes(inputValue.toLowerCase()) || inputValue === '')) {
          suggestions.push({
            type: 'department',
            id: dept.id,
            name: dept.name
          });
        }
      });
    }
    
    // Filter categories
    if (filterType === 'category') {
      departments.forEach(dept => {
        dept.categories.forEach(cat => {
          if (!existingCategoryIds.has(cat.id) && 
              (cat.name.toLowerCase().includes(inputValue.toLowerCase()) || inputValue === '')) {
            suggestions.push({
              type: 'category',
              id: cat.id,
              name: cat.name,
              parentId: dept.id
            });
          }
        });
      });
    }
    
    // Filter subcategories
    if (filterType === 'subcategory') {
      departments.forEach(dept => {
        dept.categories.forEach(cat => {
          cat.subcategories.forEach(subcat => {
            if (!existingSubcategoryIds.has(subcat.id) && 
                (subcat.name.toLowerCase().includes(inputValue.toLowerCase()) || inputValue === '')) {
              suggestions.push({
                type: 'subcategory',
                id: subcat.id,
                name: subcat.name,
                parentId: cat.id
              });
            }
          });
        });
      });
    }
    
    return suggestions;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 p-2 border rounded-lg bg-background border-input mb-2">
          {tags.map((tag, index) => (
            <Badge 
              key={`${tag.type}-${tag.id}`} 
              className="px-3 py-1 flex items-center gap-1"
              variant="secondary"
            >
              <span className="text-xs text-muted-foreground mr-1">
                {tag.type.charAt(0).toUpperCase() + tag.type.slice(1)}:
              </span>
              {tag.name}
              <button 
                type="button" 
                onClick={() => onRemoveTag(index)}
                className="ml-1 hover:bg-muted rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          <div className="flex-1 flex items-center">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 border-dashed text-xs mr-2"
                >
                  Add Filter <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-60" align="start">
                <div className="grid grid-cols-3 border-b">
                  <button
                    type="button"
                    className={`p-2 text-xs ${filterType === 'department' ? 'bg-muted font-medium' : ''}`}
                    onClick={() => setFilterType('department')}
                  >
                    Department
                  </button>
                  <button
                    type="button"
                    className={`p-2 text-xs ${filterType === 'category' ? 'bg-muted font-medium' : ''}`}
                    onClick={() => setFilterType('category')}
                  >
                    Category
                  </button>
                  <button
                    type="button"
                    className={`p-2 text-xs ${filterType === 'subcategory' ? 'bg-muted font-medium' : ''}`}
                    onClick={() => setFilterType('subcategory')}
                  >
                    Subcategory
                  </button>
                </div>
                <Command>
                  <CommandInput 
                    placeholder={`Search ${filterType}...`}
                    value={inputValue}
                    onValueChange={setInputValue}
                  />
                  <CommandList>
                    <CommandEmpty>No {filterType} found.</CommandEmpty>
                    <CommandGroup>
                      {getSuggestions().map((suggestion) => (
                        <CommandItem
                          key={`${suggestion.type}-${suggestion.id}`}
                          onSelect={() => {
                            onAddTag(suggestion);
                            setInputValue('');
                            setOpen(false);
                            inputRef.current?.focus();
                          }}
                        >
                          {suggestion.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            <Input
              type="text"
              placeholder="Search for services (e.g., laptop, health insurance, expenses...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-none shadow-none focus-visible:ring-0 text-lg pl-0"
              ref={inputRef}
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          size="icon" 
          className="absolute right-2 top-2 h-10 w-10 bg-brand-600 hover:bg-brand-700"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
