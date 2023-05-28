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

export type TelemetrieProduct = {
  // for every cartItem
  product: Product;
  calculatedPrice: number;
  choosenSize?: string;
  choosenSugar?: string;
  choosenMug?: string;
  choosenLid?: string;
  quantity: number;
  discount: number;
  // ---

  timeStamp: string; //generate, einmal für den gesamten checkout
  displayNumber: string; //displayContext
  city: string; //JSON
  location: string; //JSON
};
