
import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import Header from '@/components/Header';
import { searchServices } from '@/utils/search';
import { Department } from '@/types/directory';

const Index = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ departments: Department[], matches: number }>({ departments: [], matches: 0 });

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.trim()) {
      const searchResults = searchServices(searchQuery);
      setResults(searchResults);
    } else {
      setResults({ departments: [], matches: 0 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">JIRA Service Search</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the services you need across JIRA departments. Start by searching for keywords like "laptop", "expenses", or "contract".
          </p>
        </div>
        
        <SearchBar onSearch={handleSearch} />
        
        <div className="mt-8">
          <SearchResults results={results} query={query} />
          
          {!query && (
            <div className="mt-12 text-center animate-fade-in">
              <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-3">Quick Tips</h2>
                <ul className="text-left text-muted-foreground space-y-2">
                  <li>• Search for a service by name or description</li>
                  <li>• Results are organized by department, category, and subcategory</li>
                  <li>• Click on a service to see more details and actions</li>
                  <li>• Use specific terms for better results (e.g., "request laptop" instead of just "request")</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-card border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} JIRA Service Search | For company use only
        </div>
      </footer>
    </div>
  );
};

export default Index;
