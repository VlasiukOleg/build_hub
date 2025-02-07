export enum Pages {
  CATALOG = 'catalog',
  SHTUKATURKA = 'shtukaturka',
  GIPSOKARTON = 'gipsokarton',
  ORDER = 'order',
  STYAZHKA = 'styazhka',
}

export interface Material {
  id: number;
  image: string;
  title: string;
  description: string;
  weight: number;
  price: number;
  quantity: number;
  totalPrice: number;
}
