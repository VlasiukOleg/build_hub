export enum Pages {
  CATALOG = 'catalog',
  SHTUKATURKA = 'shtukaturka',
  GIPSOKARTON = 'gipsokarton',
  ORDER = 'order',
  STYAZHKA = 'styazhka',
  KLADKA = 'kladka',
}

export interface ConfigurableList {
  label: string;
  key: string;
  price: number;
  weight: number;
  volume: number;
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
  volume: number;
  officialLink: string;
  movingTypeCalculation: string;
  configurableList?: ConfigurableList[];
}

export interface AdditionalMaterial {
  id: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
  volume: number;
  weight: number;
  movingTypeCalculation: string;
  measure: string;
}
