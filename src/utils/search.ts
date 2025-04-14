
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
  // Enhanced search algorithm with better matching and relevance scoring
  const textMatches = (text: string): { matched: boolean; score: number } => {
    if (!text) return { matched: false, score: 0 };
    
    const lowerText = text.toLowerCase();
    
    // Check for exact phrase match first (highest priority)
    if (lowerText === query.toLowerCase()) {
      return { matched: true, score: 10 }; // Perfect match gets highest score
    }
    
    // Check if text starts with the query (high priority)
    if (lowerText.startsWith(query.toLowerCase())) {
      return { matched: true, score: 8 };
    }
    
    // Check for exact phrase match (high priority)
    if (lowerText.includes(query.toLowerCase())) {
      return { matched: true, score: 6 };
    }
    
    // Check for all terms appearing in order (medium-high priority)
    let allTermsInOrder = true;
    let lastIndex = -1;
    for (const term of searchTerms) {
      const index = lowerText.indexOf(term);
      if (index === -1 || index < lastIndex) {
        allTermsInOrder = false;
        break;
      }
      lastIndex = index;
    }
    
    if (allTermsInOrder) {
      return { matched: true, score: 5 };
    }
    
    // Check for all terms appearing (medium priority)
    const allTermsMatch = searchTerms.every(term => lowerText.includes(term));
    if (allTermsMatch) {
      return { matched: true, score: 4 };
    }
    
    // Count how many terms match for partial scoring
    const matchingTerms = searchTerms.filter(term => lowerText.includes(term));
    const matchRatio = matchingTerms.length / searchTerms.length;
    
    // If more than half the terms match, consider it a partial match
    if (matchRatio >= 0.5) {
      return { matched: true, score: 3 * matchRatio };
    }
    
    // Check for any terms appearing (lowest priority)
    const anyTermMatch = searchTerms.some(term => lowerText.includes(term));
    if (anyTermMatch) {
      return { matched: true, score: 1 };
    }
    
    // Word proximity scoring - check if terms appear close to each other
    if (searchTerms.length > 1) {
      const words = lowerText.split(/\s+/);
      let proximity = false;
      
      for (let i = 0; i < words.length - 1; i++) {
        if (searchTerms.some(term => words[i].includes(term)) && 
            searchTerms.some(term => words[i+1].includes(term))) {
          proximity = true;
          break;
        }
      }
      
      if (proximity) {
        return { matched: true, score: 2 };
      }
    }
    
    return { matched: false, score: 0 };
  };

  // Deep clone and filter the departments structure with improved relevance scoring
  const filteredDepartments = mockDepartments
    .map(department => {
      // Check department name and description
      const departmentMatch = textMatches(department.name);
      const descriptionMatch = textMatches(department.description);
      const departmentMatches = departmentMatch.matched || descriptionMatch.matched;
      const departmentScore = Math.max(departmentMatch.score, descriptionMatch.score);
      
      // Filter categories
      const filteredCategories = department.categories
        .map(category => {
          // Check category name and description
          const categoryMatch = textMatches(category.name);
          const categoryDescMatch = textMatches(category.description);
          const categoryMatches = categoryMatch.matched || categoryDescMatch.matched;
          const categoryScore = Math.max(categoryMatch.score, categoryDescMatch.score);
          
          // Filter subcategories
          const filteredSubcategories = category.subcategories
            .map(subcategory => {
              // Check subcategory name and description
              const subcategoryMatch = textMatches(subcategory.name);
              const subcategoryDescMatch = textMatches(subcategory.description);
              const subcategoryMatches = subcategoryMatch.matched || subcategoryDescMatch.matched;
              const subcategoryScore = Math.max(subcategoryMatch.score, subcategoryDescMatch.score);
              
              // Filter services
              const filteredServices = subcategory.services
                .filter(service => {
                  // Check service name and description
                  const serviceMatch = textMatches(service.name);
                  const serviceDescMatch = textMatches(service.description);
                  return serviceMatch.matched || serviceDescMatch.matched;
                })
                // Sort services by match score (higher scores first)
                .sort((a, b) => {
                  const scoreA = Math.max(
                    textMatches(a.name).score, 
                    textMatches(a.description).score
                  );
                  const scoreB = Math.max(
                    textMatches(b.name).score, 
                    textMatches(b.description).score
                  );
                  return scoreB - scoreA;
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

  // Sort the departments by relevance score
  filteredDepartments.sort((a, b) => {
    const scoreA = Math.max(
      textMatches(a.name).score, 
      textMatches(a.description).score
    );
    const scoreB = Math.max(
      textMatches(b.name).score, 
      textMatches(b.description).score
    );
    return scoreB - scoreA;
  });

  return { 
    departments: filteredDepartments,
    matches: totalMatches
  };
}
