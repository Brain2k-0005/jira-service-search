
import React from 'react';
import { Department } from '@/types/directory';
import { ChevronRight, ExternalLink, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchResultsProps {
  results: {
    departments: Department[];
    matches: number;
  };
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, query }) => {
  const { departments, matches } = results;

  if (!query) {
    return null;
  }

  if (matches === 0) {
    return (
      <div className="mt-8 text-center animate-fade-in">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No results found</h2>
        <p className="text-gray-600">Try different keywords or check the spelling</p>
      </div>
    );
  }

  return (
    <div className="mt-8 animate-fade-in">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Found {matches} {matches === 1 ? 'result' : 'results'} for "{query}"
        </h2>
      </div>

      {departments.map((department) => (
        <Card key={department.id} className="mb-6 shadow-sm border-gray-200">
          <CardContent className="pt-4">
            <h3 className="text-lg font-semibold text-brand-800 flex items-center">
              {department.name}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{department.description}</p>

            {department.categories.map((category) => (
              <div key={category.id} className="ml-4 mb-4">
                <div className="flex items-center text-gray-800 font-medium">
                  <ChevronRight className="h-4 w-4 text-gray-400 mr-1" />
                  {category.name}
                </div>
                <p className="text-sm text-gray-600 ml-5 mb-2">{category.description}</p>

                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.id} className="ml-10 mb-3">
                    <div className="flex items-center text-gray-700">
                      <ChevronRight className="h-4 w-4 text-gray-400 mr-1" />
                      {subcategory.name}
                    </div>
                    <p className="text-sm text-gray-600 ml-5 mb-2">{subcategory.description}</p>

                    <div className="ml-5">
                      <Accordion type="single" collapsible className="w-full">
                        {subcategory.services.map((service) => (
                          <AccordionItem key={service.id} value={service.id} className="border-b-0">
                            <AccordionTrigger className="py-2 text-gray-700 hover:text-brand-700 hover:no-underline">
                              <div className="flex items-center">
                                <ChevronRight className="h-4 w-4 text-gray-400 mr-1" />
                                {service.name}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="ml-5 pb-4">
                              <p className="text-sm text-gray-600 mb-3">{service.description}</p>
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
                                    className="text-xs flex items-center gap-1 text-gray-700 border-gray-300 hover:bg-gray-50"
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
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;
