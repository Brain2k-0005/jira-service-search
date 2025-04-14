
import { Department, SearchResult } from "../types/directory";
import { mockDepartments } from "../data/mockData";

// Search function to find services matching the query
export function searchServices(query: string): SearchResult {
  if (!query.trim()) {
    return { departments: [], matches: 0 };
  }

  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  let totalMatches = 0;
  
  // Helper function to check if text contains any of the search terms
  const textMatches = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return searchTerms.some(term => lowerText.includes(term));
  };

  // Deep clone and filter the departments structure
  const filteredDepartments = mockDepartments
    .map(department => {
      // Check department name and description
      const departmentMatches = textMatches(department.name) || 
                                textMatches(department.description);
      
      // Filter categories
      const filteredCategories = department.categories
        .map(category => {
          // Check category name and description
          const categoryMatches = textMatches(category.name) || 
                                  textMatches(category.description);
          
          // Filter subcategories
          const filteredSubcategories = category.subcategories
            .map(subcategory => {
              // Check subcategory name and description
              const subcategoryMatches = textMatches(subcategory.name) || 
                                        textMatches(subcategory.description);
              
              // Filter services
              const filteredServices = subcategory.services
                .filter(service => {
                  // Check service name and description
                  return textMatches(service.name) || 
                         textMatches(service.description);
                });
              
              // If any services match or the subcategory itself matches, include it
              if (filteredServices.length > 0 || subcategoryMatches) {
                totalMatches += filteredServices.length + (subcategoryMatches ? 1 : 0);
                return {
                  ...subcategory,
                  services: filteredServices
                };
              }
              return null;
            })
            .filter(Boolean);
          
          // If any subcategories remain or the category itself matches, include it
          if (filteredSubcategories.length > 0 || categoryMatches) {
            totalMatches += categoryMatches ? 1 : 0;
            return {
              ...category,
              subcategories: filteredSubcategories as any
            };
          }
          return null;
        })
        .filter(Boolean);
      
      // If any categories remain or the department itself matches, include it
      if (filteredCategories.length > 0 || departmentMatches) {
        totalMatches += departmentMatches ? 1 : 0;
        return {
          ...department,
          categories: filteredCategories as any
        };
      }
      return null;
    })
    .filter(Boolean) as Department[];

  return { 
    departments: filteredDepartments,
    matches: totalMatches
  };
}
