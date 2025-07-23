export type Fruit = {
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