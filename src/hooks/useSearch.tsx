
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TagType, SearchFilters } from '@/types/search';
import { Department } from '@/types/directory';
import { searchServices } from '@/utils/search';

export function useSearch(departments: Department[]) {
  const [query, setQuery] = useState('');
  const [tags, setTags] = useState<TagType[]>([]);
  const [results, setResults] = useState<{ departments: Department[], matches: number }>({ departments: [], matches: 0 });
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
      performSearch(urlQuery, urlTags);
    }
  }, [location.search]);

  // Update URL when filters change
  useEffect(() => {
    updateUrl();
  }, [query, tags]);

  // Perform search with current filters
  const performSearch = (searchQuery: string, searchTags: TagType[] = tags) => {
    if (searchQuery.trim() || searchTags.length > 0) {
      try {
        const searchResults = searchServices(searchQuery, searchTags);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults({ departments: [], matches: 0 });
      }
    } else {
      setResults({ departments: [], matches: 0 });
    }
  };

  // Update the URL with current search parameters
  const updateUrl = () => {
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
  };

  // Handler for search submissions
  const handleSearch = (newQuery: string, newTags?: TagType[]) => {
    const updatedTags = newTags || tags;
    setQuery(newQuery);
    
    if (newTags !== undefined) {
      setTags(newTags);
    }
    
    performSearch(newQuery, updatedTags);
  };

  // Add a tag to the current filters
  const addTag = (tag: TagType) => {
    // Don't add duplicate tags
    if (!tags.some(t => t.id === tag.id && t.type === tag.type)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      performSearch(query, newTags);
    }
  };

  // Remove a tag from the current filters
  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
    performSearch(query, newTags);
  };

  return {
    query,
    tags,
    results,
    handleSearch,
    addTag,
    removeTag
  };
}
