'use client';

import CatalogCard from '@/components/ui/CatalogCard';
import { Breadcrumbs, BreadcrumbItem } from '@heroui/react';

import Shtukaturka from '@/../public/images/shtukaturka-450x300.webp';
import Gipsokarton from '@/../public/images/gipsokarton-450х300.webp';
import Styazhka from '@/../public/images/styazhka.jpg';
import Kladka from '@/../public/images/kladka.webp';
import Shpaklivka from '@/../public/images/spackling.jpg';
import Uteplenya from '@/../public/images/Uteplenie-450x300.jpg'

import { Pages } from '@/@types';

const catalog = [
  {
    id: 1,
    text: 'Ручна та машина штукатурка',
    img: Shtukaturka,
    href: 'shtukaturka',
  },
  {
    id: 2,
    text: 'Гіпсокартон',
    img: Gipsokarton,
    href: 'gipsokarton',
  },
  {
    id: 3,
    text: 'Фінішна шпаклівка. Фарбування ',
    img: Shpaklivka,
    href: 'shpaklivka',
  },
  {
    id: 4,
    text: 'Утеплення. Фасадні роботи',
    img: Uteplenya,
    href: 'uteplenya',
  },
  {
    id: 5,
    text: 'Стяжка. Цемент. Пісок',
    img: Styazhka,
    href: 'styazhka',
  },
  {
    id: 6,
    text: 'Кладочні роботи',
    img: Kladka,
    href: 'kladka',
  },
];

interface ICatalogProps {}

const Catalog: React.FC<ICatalogProps> = ({}) => {
  return (
    <section className="py-4 md:py-8">
      <div className="container">
        <Breadcrumbs className="mb-4">
          <BreadcrumbItem href="/">Головна</BreadcrumbItem>
          <BreadcrumbItem href={`${Pages.CATALOG}`}>Каталог</BreadcrumbItem>
        </Breadcrumbs>
        <h1 className="font-unbounded xl:text-2xl font-bold text-center mb-5  md:text-lg">
          Оберіть потрібну Вам категорію будівельних робіт
        </h1>
        <ul className="flex justify-center flex-wrap gap-5 uppercase font-medium text-xl md:text-base">
          {catalog.map(item => (
            <CatalogCard
              id={item.id}
              key={item.id}
              img={item.img}
              text={item.text}
              href={item.href}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Catalog;
