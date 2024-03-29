import { FluidObject } from 'gatsby-image';

export type Theme = 'white' | 'black';

export type Image = {
  id?: string;
  title?: string;
  description?: string;
  fluid: FluidObject;
};

export interface PageData {
  meta_title?: string;
  meta_description?: string;
  title?: string;
  content: {
    json: any;
  };
  images?: Image[];
}

export type Product = {
  id: string;
  productContentful: {
    title: string;
    slug: string;
    weight: number;
    price: number;
    images: Image[];
    status: 'Active' | 'Sold' | 'OnRequest' | 'DirectLink' | 'PreOrder';
  };
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  description?: {
    json: any;
    references: any;
  };
  featuredImage: ImageType;
};

export type DeliveryType = {
  price: number;
  days: number;
};

export type DiscountType = {
  discount: number;
  valid: boolean;
  free_delivery: boolean;
};

export type Action = {
  type: string;
  payload?: any;
};

export type ShoppingCart = string[];

export type Store = {
  shoppingCart: ShoppingCart;
  availableProducts?: string[];
};

export type OrderItem = {
  id: string;
  quantity: number;
  price: number;
};

export type Order = {
  items: OrderItem[];
  delivery: DeliveryType;
  discount?: DiscountType | null;
};
