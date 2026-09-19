export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  gallery?: string[];
  features?: string[];
  rating: {
    rate: number;
    count: number;
  };
  stock: number;
}

export type FetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ProductsState {
  items: Product[];
  status: FetchStatus;
  error: string | null;
  selectedCategory: string;
  searchQuery: string;
  isSearching: boolean;
  dataSourceMode: 'thunk' | 'rtk-query';
  selectedProduct: Product | null;
}
