
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
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

interface TagType {
  type: 'department' | 'category' | 'subcategory';
  id: string;
  name: string;
  parentId?: string;
}

interface SearchBarProps {
  onSearch: (query: string, tags?: TagType[]) => void;
  initialQuery?: string;
  departments: Department[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '', departments }) => {
  const [query, setQuery] = useState(initialQuery);
  const [tags, setTags] = useState<TagType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filterType, setFilterType] = useState<'department' | 'category' | 'subcategory'>('department');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load filters from URL on initial render
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlQuery = searchParams.get('q') || '';
    const urlTags: TagType[] = [];
    
    searchParams.getAll('department').forEach(dep => {
      const [id, name] = dep.split(':');
      if (id && name) {
        urlTags.push({ type: 'department', id, name });
      }
    });
    
    searchParams.getAll('category').forEach(cat => {
      const [id, name, parentId] = cat.split(':');
      if (id && name && parentId) {
        urlTags.push({ type: 'category', id, name, parentId });
      }
    });
    
    searchParams.getAll('subcategory').forEach(subcat => {
      const [id, name, parentId] = subcat.split(':');
      if (id && name && parentId) {
        urlTags.push({ type: 'subcategory', id, name, parentId });
      }
    });
    
    setQuery(urlQuery);
    setTags(urlTags);
    
    if (urlQuery || urlTags.length > 0) {
      onSearch(urlQuery, urlTags);
    }
  }, [location.search, onSearch]);

  // Update URL when filters change
  useEffect(() => {
    const searchParams = new URLSearchParams();
    
    if (query) {
      searchParams.set('q', query);
    }
    
    tags.forEach(tag => {
      if (tag.type === 'department') {
        searchParams.append('department', `${tag.id}:${tag.name}`);
      } else if (tag.type === 'category') {
        searchParams.append('category', `${tag.id}:${tag.name}:${tag.parentId}`);
      } else if (tag.type === 'subcategory') {
        searchParams.append('subcategory', `${tag.id}:${tag.name}:${tag.parentId}`);
      }
    });
    
    const searchString = searchParams.toString();
    const newUrl = searchString ? `/?${searchString}` : '/';
    
    // Only update if the URL would actually change
    if (location.search !== `?${searchString}` && (location.pathname !== '/' || searchString)) {
      navigate(newUrl, { replace: true });
    }
  }, [query, tags, navigate, location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, tags);
  };

  const addTag = (tag: TagType) => {
    // Don't add duplicate tags
    if (!tags.some(t => t.id === tag.id && t.type === tag.type)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      onSearch(query, newTags);
    }
    setInputValue('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
    onSearch(query, newTags);
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
                onClick={() => removeTag(index)}
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
                          onSelect={() => addTag(suggestion)}
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
