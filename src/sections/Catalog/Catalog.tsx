'use client';

import { useRouter } from 'next/navigation';
import CatalogCard from '@/components/ui/CatalogCard';
import { Breadcrumbs, BreadcrumbItem, Button, Tabs, Tab } from '@heroui/react';

import { useAppSelector } from '@/redux/hooks';

import Shtukaturka from '@/../public/images/shtukaturka-450x300.webp';
import Gipsokarton from '@/../public/images/gipsokarton-450х300.webp';
import Styazhka from '@/../public/images/styazhka.jpg';
import Kladka from '@/../public/images/kladka.webp';
import Shpaklivka from '@/../public/images/spackling.jpg';
import Uteplenya from '@/../public/images/Uteplenie-450x300.jpg';
import Plytka from '@/../public/images/ukladannia-plytky-450x300.webp';

import Dveri from '@/../public/images/skritiy-korob-farbovana-bez-obrlada1.jpg.webp';
import Pidloga from '@/../public/images/ilgp40273_1.jpg';
import Laminat from '@/../public/images/image_6818cb50355b7.jpg';

import { Pages } from '@/@types';

import { IoLocationSharp } from 'react-icons/io5';

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
    text: 'Плиточні роботи',
    img: Plytka,
    href: 'plitka',
  },
  {
    id: 7,
    text: 'Кладочні роботи',
    img: Kladka,
    href: 'kladka',
  },
];

const catalogChornovi = [
  {
    id: 1,
    text: 'Двері',
    img: Dveri,
    href: '',
  },
  {
    id: 2,
    text: 'Вінілова підлога',
    img: Pidloga,
    href: '',
  },
  {
    id: 3,
    text: 'Ламінат',
    img: Laminat,
    href: '',
  },
  {
    id: 4,
    text: 'Натяжні стелі',
    img: Uteplenya,
    href: '',
  },
  {
    id: 5,
    text: 'Стяжка. Цемент. Пісок',
    img: Styazhka,
    href: '',
  },
  {
    id: 6,
    text: 'Плиточні роботи',
    img: Plytka,
    href: '',
  },
  {
    id: 7,
    text: 'Кладочні роботи',
    img: Kladka,
    href: '',
  },
];

interface ICatalogProps {}

const Catalog: React.FC<ICatalogProps> = ({}) => {
  const router = useRouter();

  const city = useAppSelector(state => state.city.city);

  const isLviv = city?.includes('lviv');

  const title = isLviv
    ? 'Для замовлення будматеріалів у Львові та області оберіть потрібну Вам категорію будівельних робіт'
    : 'Для замовлення будматеріалів в Києві та області оберіть потрібну Вам категорію будівельних робіт';

  const deliveryStorage = useAppSelector(
    state => state.delivery.deliveryStorage
  );

  const handleStorageClick = () => {
    const url = `/?from=catalog`;
    router.push(url);
  };

  return (
    <section className="py-4 md:py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-2">
          <Breadcrumbs className="">
            <BreadcrumbItem href="/">Головна</BreadcrumbItem>
            <BreadcrumbItem href={`${Pages.CATALOG}`}>Каталог</BreadcrumbItem>
          </Breadcrumbs>
          <Button
            type="submit"
            size="sm"
            className="font-medium min-h-5 text-sm"
            radius="sm"
            onPress={handleStorageClick}
            startContent={
              <IoLocationSharp className="size-4 text-danger-500" />
            }
            variant="light"
          >
            {isLviv ? 'Львів' : 'Київ'}
          </Button>
        </div>

        {!deliveryStorage && (
          <div className="flex  mb-2">
            <Button
              type="submit"
              size="sm"
              className=" text-accent font-medium text-xs min-h-5 xl:text-sm"
              radius="sm"
              onPress={handleStorageClick}
              variant="bordered"
            >
              Вибрати склад завантаження
            </Button>
          </div>
        )}

        <h1 className="font-unbounded xl:text-2xl font-bold text-center mb-5  md:text-lg">
          {title}
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
        {/* <Tabs
          color="primary"
          size="md"
          className="flex justify-center items-center"
        >
          <Tab key="chornovi" title="Чорнові матеріали">
            <h1 className="font-unbounded xl:text-2xl font-bold text-center mb-5  md:text-lg">
              Для замовлення будматеріалів оберіть потрібну Вам категорію
              будівельних робіт
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
          </Tab>
          <Tab key="chistovi" title="Чистові матеріали">
            <h1 className="font-unbounded xl:text-2xl font-bold text-center mb-5  md:text-lg">
              Для замовлення матеріалів оберіть потрібну Вам категорію
            </h1>
            <ul className="flex justify-center flex-wrap gap-5 uppercase font-medium text-xl md:text-base">
              {catalogChornovi.map(item => (
                <CatalogCard
                  id={item.id}
                  key={item.id}
                  img={item.img}
                  text={item.text}
                  href={item.href}
                />
              ))}
            </ul>
          </Tab>
        </Tabs> */}
      </div>
    </section>
  );
};

export default Catalog;
