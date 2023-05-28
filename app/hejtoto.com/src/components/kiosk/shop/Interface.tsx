// Interface.tsx

export type VerticalTabsProps = {
  data: Category[];
  country: string;
  currency: string;
};

export type Category = {
  name: string;
  additives?: string[];
  mugs?: string[];
  lids?: string[];
  products: Product[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  sizes: { size: string; additionalCost: number }[];
  allergens: string[];
  vegan: boolean;
  glutenfree: boolean;
  additives?: string[];
  mugs?: string[];
  lids?: string[];
};
