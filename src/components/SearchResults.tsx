
import React, { useState } from 'react';
import { Department } from '@/types/directory';
import { ChevronRight, ExternalLink, Mail, ChevronDown, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

interface SearchResultsProps {
  results: {
    departments: Department[];
    matches: number;
  };
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, query }) => {
  const { departments, matches } = results;
  const [expandedDepartments, setExpandedDepartments] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({});

  // Initialize expanded state based on search results
  React.useEffect(() => {
    if (departments.length > 0) {
      const newExpandedDepartments: Record<string, boolean> = {};
      const newExpandedCategories: Record<string, boolean> = {};
      const newExpandedSubcategories: Record<string, boolean> = {};

      departments.forEach(dept => {
        newExpandedDepartments[dept.id] = true;
        
        dept.categories.forEach(cat => {
          newExpandedCategories[cat.id] = true;
          
          cat.subcategories.forEach(subcat => {
            newExpandedSubcategories[subcat.id] = true;
          });
        });
      });

      setExpandedDepartments(newExpandedDepartments);
      setExpandedCategories(newExpandedCategories);
      setExpandedSubcategories(newExpandedSubcategories);
    }
  }, [departments]);

  const toggleDepartment = (id: string) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleSubcategory = (id: string) => {
    setExpandedSubcategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!query) {
    return null;
  }

  if (matches === 0) {
    return (
      <div className="mt-8 text-center animate-fade-in">
        <h2 className="text-2xl font-semibold text-foreground mb-2">No results found</h2>
        <p className="text-muted-foreground">Try different keywords or check the spelling</p>
      </div>
    );
  }

  return (
    <div className="mt-8 animate-fade-in">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">
          Found {matches} {matches === 1 ? 'result' : 'results'} for "{query}"
        </h2>
      </div>

      {departments.map((department) => (
        <Card key={department.id} className="mb-6 shadow-sm border-border">
          <CardContent className="pt-4">
            <button 
              onClick={() => toggleDepartment(department.id)}
              className="w-full text-left py-2 flex items-center text-lg font-semibold text-foreground group"
            >
              {expandedDepartments[department.id] ? 
                <ChevronDown className="h-4 w-4 text-muted-foreground mr-1 group-hover:text-foreground transition-colors" /> : 
                <ChevronRight className="h-4 w-4 text-muted-foreground mr-1 group-hover:text-foreground transition-colors" />
              }
              {department.name}
            </button>
            
            {expandedDepartments[department.id] && (
              <>
                <Breadcrumb className="ml-5 mb-2">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink className="text-xs">
                        <Folder className="h-3 w-3 mr-1 inline" />
                        {department.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <p className="text-sm text-muted-foreground mb-3 ml-5">{department.description}</p>

                {department.categories.map((category) => (
                  <div key={category.id} className="ml-4 mb-4">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center text-base text-foreground font-medium py-1 group"
                    >
                      {expandedCategories[category.id] ? 
                        <ChevronDown className="h-4 w-4 text-muted-foreground mr-1 group-hover:text-foreground transition-colors" /> : 
                        <ChevronRight className="h-4 w-4 text-muted-foreground mr-1 group-hover:text-foreground transition-colors" />
                      }
                      {category.name}
                    </button>
                    
                    {expandedCategories[category.id] && (
                      <>
                        <Breadcrumb className="ml-5 mb-2">
                          <BreadcrumbList>
                            <BreadcrumbItem>
                              <BreadcrumbLink className="text-xs">
                                <Folder className="h-3 w-3 mr-1 inline" />
                                {department.name}
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                              <BreadcrumbLink className="text-xs">
                                {category.name}
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                          </BreadcrumbList>
                        </Breadcrumb>
                        <p className="text-sm text-muted-foreground ml-5 mb-2">{category.description}</p>

                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="ml-6 mb-3">
                            <button
                              onClick={() => toggleSubcategory(subcategory.id)}
                              className="flex items-center text-sm text-foreground py-1 group"
                            >
                              {expandedSubcategories[subcategory.id] ? 
                                <ChevronDown className="h-4 w-4 text-muted-foreground mr-1 group-hover:text-foreground transition-colors" /> : 
                                <ChevronRight className="h-4 w-4 text-muted-foreground mr-1 group-hover:text-foreground transition-colors" />
                              }
                              {subcategory.name}
                            </button>
                            
                            {expandedSubcategories[subcategory.id] && (
                              <>
                                <Breadcrumb className="ml-5 mb-2">
                                  <BreadcrumbList>
                                    <BreadcrumbItem>
                                      <BreadcrumbLink className="text-xs">
                                        <Folder className="h-3 w-3 mr-1 inline" />
                                        {department.name}
                                      </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                      <BreadcrumbLink className="text-xs">
                                        {category.name}
                                      </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                      <BreadcrumbPage className="text-xs">
                                        {subcategory.name}
                                      </BreadcrumbPage>
                                    </BreadcrumbItem>
                                  </BreadcrumbList>
                                </Breadcrumb>
                                <p className="text-sm text-muted-foreground ml-5 mb-2">{subcategory.description}</p>

                                <div className="ml-5">
                                  <Accordion type="single" collapsible className="w-full">
                                    {subcategory.services.map((service) => (
                                      <AccordionItem key={service.id} value={service.id} className="border-b-0">
                                        <AccordionTrigger className="py-2 text-foreground hover:text-brand-700 hover:no-underline">
                                          <div className="flex items-center">
                                            <ChevronRight className="h-4 w-4 text-muted-foreground mr-1" />
                                            {service.name}
                                          </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="ml-5 pb-4">
                                          <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                                          <div className="flex flex-wrap gap-2">
                                            {service.link && (
                                              <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="text-xs flex items-center gap-1 text-brand-700 border-brand-300 hover:bg-brand-50"
                                                onClick={() => window.open(service.link, '_blank')}
                                              >
                                                <ExternalLink className="h-3 w-3" />
                                                Open Service
                                              </Button>
                                            )}
                                            {service.contactEmail && (
                                              <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="text-xs flex items-center gap-1 text-foreground border-border hover:bg-secondary/50"
                                                onClick={() => window.location.href = `mailto:${service.contactEmail}`}
                                              >
                                                <Mail className="h-3 w-3" />
                                                Contact
                                              </Button>
                                            )}
                                          </div>
                                        </AccordionContent>
                                      </AccordionItem>
                                    ))}
                                  </Accordion>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;
