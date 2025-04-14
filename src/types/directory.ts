
export interface Service {
  id: string;
  name: string;
  description: string;
  link?: string;
  contactEmail?: string;
  subcategoryId: string;
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  services: Service[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  departmentId: string;
  subcategories: Subcategory[];
}

export interface Department {
  id: string;
  name: string;
  description: string;
  categories: Category[];
}

export interface SearchResult {
  departments: Department[];
  matches: number;
}
