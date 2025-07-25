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
  id: number;
  driver_id: number;
  user_id: number;
  customer_name: string;
  customer_phone: string;
  destination_address: string;
  destination_latitude: number;
  destination_longitude: number;
  delivery_status: string;
  payment_status: string;
  payment_method: string;
  created: string;
  updated: string;
  items: Product[];
  total: number;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image_name?: string;
  quantity: number;
};