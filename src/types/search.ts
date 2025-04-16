
export interface TagType {
  type: 'department' | 'category' | 'subcategory';
  id: string;
  name: string;
  parentId?: string;
}

export interface SearchFilters {
  query: string;
  tags: TagType[];
}
