import { Department, SearchResult } from "../types/directory";
import { mockDepartments } from "../data/mockData";
import { TagType } from "../types/search";

// Search function to find services matching the query and tags
export function searchServices(query: string, tags?: TagType[]): SearchResult {
  // If no query and no tags, return empty result
  if (!query.trim() && (!tags || tags.length === 0)) {
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

  // Function to check if a department matches any tag filters
  const departmentMatchesTags = (dept: Department, tagFilters?: TagType[]): boolean => {
    if (!tagFilters || tagFilters.length === 0) return true;
    
    // Check if this department is in the department filters
    const departmentTags = tagFilters.filter(t => t.type === 'department');
    if (departmentTags.length > 0 && !departmentTags.some(t => t.id === dept.id)) {
      return false;
    }
    
    return true;
  };
  
  // Function to check if a category matches any tag filters
  const categoryMatchesTags = (dept: Department, cat: any, tagFilters?: TagType[]): boolean => {
    if (!tagFilters || tagFilters.length === 0) return true;
    
    // Check if parent department is filtered
    const departmentTags = tagFilters.filter(t => t.type === 'department');
    if (departmentTags.length > 0 && !departmentTags.some(t => t.id === dept.id)) {
      return false;
    }
    
    // Check if this category is in the category filters
    const categoryTags = tagFilters.filter(t => t.type === 'category');
    if (categoryTags.length > 0 && !categoryTags.some(t => t.id === cat.id)) {
      return false;
    }
    
    return true;
  };
  
  // Function to check if a subcategory matches any tag filters
  const subcategoryMatchesTags = (dept: Department, cat: any, subcat: any, tagFilters?: TagType[]): boolean => {
    if (!tagFilters || tagFilters.length === 0) return true;
    
    // Check if parent department is filtered
    const departmentTags = tagFilters.filter(t => t.type === 'department');
    if (departmentTags.length > 0 && !departmentTags.some(t => t.id === dept.id)) {
      return false;
    }
    
    // Check if parent category is filtered
    const categoryTags = tagFilters.filter(t => t.type === 'category');
    if (categoryTags.length > 0 && !categoryTags.some(t => t.id === cat.id)) {
      return false;
    }
    
    // Check if this subcategory is in the subcategory filters
    const subcategoryTags = tagFilters.filter(t => t.type === 'subcategory');
    if (subcategoryTags.length > 0 && !subcategoryTags.some(t => t.id === subcat.id)) {
      return false;
    }
    
    return true;
  };

  // Deep clone and filter the departments structure with improved relevance scoring
  const filteredDepartments = mockDepartments
    .map(department => {
      // Skip departments that don't match tag filters
      if (!departmentMatchesTags(department, tags)) {
        return null;
      }
      
      // Check department name and description
      const departmentMatch = query.trim() ? textMatches(department.name) : { matched: false, score: 0 };
      const descriptionMatch = query.trim() ? textMatches(department.description) : { matched: false, score: 0 };
      const departmentMatches = departmentMatch.matched || descriptionMatch.matched;
      const departmentScore = Math.max(departmentMatch.score, descriptionMatch.score);
      
      // Filter categories
      const filteredCategories = department.categories
        .map(category => {
          // Skip categories that don't match tag filters
          if (!categoryMatchesTags(department, category, tags)) {
            return null;
          }
          
          // Check category name and description
          const categoryMatch = query.trim() ? textMatches(category.name) : { matched: false, score: 0 };
          const categoryDescMatch = query.trim() ? textMatches(category.description) : { matched: false, score: 0 };
          const categoryMatches = categoryMatch.matched || categoryDescMatch.matched;
          const categoryScore = Math.max(categoryMatch.score, categoryDescMatch.score);
          
          // Filter subcategories
          const filteredSubcategories = category.subcategories
            .map(subcategory => {
              // Skip subcategories that don't match tag filters
              if (!subcategoryMatchesTags(department, category, subcategory, tags)) {
                return null;
              }
              
              // Check subcategory name and description
              const subcategoryMatch = query.trim() ? textMatches(subcategory.name) : { matched: false, score: 0 };
              const subcategoryDescMatch = query.trim() ? textMatches(subcategory.description) : { matched: false, score: 0 };
              const subcategoryMatches = subcategoryMatch.matched || subcategoryDescMatch.matched;
              const subcategoryScore = Math.max(subcategoryMatch.score, subcategoryDescMatch.score);
              
              // Filter services
              const filteredServices = subcategory.services
                .filter(service => {
                  if (!query.trim()) return true;
                  // Check service name and description
                  const serviceMatch = textMatches(service.name);
                  const serviceDescMatch = textMatches(service.description);
                  return serviceMatch.matched || serviceDescMatch.matched;
                })
                // Sort services by match score (higher scores first)
                .sort((a, b) => {
                  if (!query.trim()) return 0;
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
              if (filteredServices.length > 0 || subcategoryMatches || (tags && tags.some(t => t.type === 'subcategory' && t.id === subcategory.id))) {
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
          if (filteredSubcategories.length > 0 || categoryMatches || (tags && tags.some(t => t.type === 'category' && t.id === category.id))) {
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
      if (filteredCategories.length > 0 || departmentMatches || (tags && tags.some(t => t.type === 'department' && t.id === department.id))) {
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
    if (!query.trim()) return 0;
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
