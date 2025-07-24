export type Product = {
  id: string | number;
  name: string;
  image?: string;
  price?: number;
  unit?: string;
  description?: string;
  category_name?: string;
};
export type Category = {
  id: string | number;
  name: string;
  icon?: string;
};

export type Order = {
  id: string | number;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
  items: Product[];
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image_name?: string;
  quantity: number;
};