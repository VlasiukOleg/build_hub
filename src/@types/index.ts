export enum Pages {
  CATALOG = 'catalog',
  SHTUKATURKA = 'shtukaturka',
  SHPAKLIVKA = 'shpaklivka',
  GIPSOKARTON = 'gipsokarton',
  ORDER = 'order',
  STYAZHKA = 'styazhka',
  KLADKA = 'kladka',
  UTEPLENYA = 'uteplenya',
}

export interface SubCategory {
  id: number;
  categoryTitle: string;
  isCategoryOpen: boolean | string;
  materials: Material[];
}

export interface ConfigurableItem {
  label: string;
  key: string;
  price: number;
  salePrice: number;
  weight: number;
  volume: number;
  movingTypeCalculation: string;
}

export interface Material {
  id: number;
  image: string;
  title: string;
  description: string;
  weight: number;
  price: number;
  salePrice: number;
  quantity: number;
  totalPrice: number;
  volume: number;
  officialLink: string;
  movingTypeCalculation: string;
  measure: string;
  configurableList?: ConfigurableItem[];
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

export interface ConfigurableMaterial {
  title: string;
  key: string;
  image: string;
  quantity: number;
  price: number;
  volume: number;
  weight: number;
  movingTypeCalculation: string;
}
