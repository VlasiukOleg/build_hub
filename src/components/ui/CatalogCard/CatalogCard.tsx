import { useMemo } from 'react';
import Link from 'next/link';
import { StaticImageData } from 'next/image';
import {
  Card,
  CardFooter,
  Image,
  Badge,
  Chip,
  CardHeader,
} from '@heroui/react';

import { useMaterials } from '@/hooks/useMaterials';
import { useAppSelector } from '@/redux/hooks';

interface ICatalogCardProps {
  id: number;
  img: StaticImageData;
  text: string;
  href: string;
}

const CatalogCard: React.FunctionComponent<ICatalogCardProps> = ({
  id,
  img,
  text,
  href,
}) => {
  const { subCategoriesBySlug } = useMaterials(href);

  const configurableMaterialList = useAppSelector(
    state => state.configurableMaterial.configurableMaterial
  );

  const configurableMaterialKeys = useMemo(
    () => configurableMaterialList.map(configurable => configurable.key),
    [configurableMaterialList]
  );

  const selectedConfigurableMaterialsCount = useMemo(
    () =>
      subCategoriesBySlug
        ?.flatMap(subCategory => subCategory.materials)
        ?.flatMap(material => material.configurableList)
        .filter(
          configurableMaterial =>
            configurableMaterial &&
            configurableMaterialKeys.includes(configurableMaterial.key)
        ).length ?? 0,
    [subCategoriesBySlug, configurableMaterialKeys]
  );

  const selectedMaterialsCount = useMemo(
    () =>
      subCategoriesBySlug
        ?.flatMap(subCategory => subCategory.materials)
        .filter(material => material.quantity > 0).length ?? 0,
    [subCategoriesBySlug]
  );

  const totalSelectedMaterialsCount =
    selectedConfigurableMaterialsCount + selectedMaterialsCount;

  return (
    <li className="relative">
      <Link href={`catalog/${href}`}>
        <Card
          isFooterBlurred
          key={id}
          shadow="sm"
          className="border-2 border-accent overflow-visible"
        >
          {totalSelectedMaterialsCount > 0 && (
            <Chip
              size="sm"
              className="bg-red-500 text-white text-xs absolute z-50 top-[-10px] right-[-10px]"
            >
              {totalSelectedMaterialsCount}
            </Chip>
          )}

          <Image
            alt={text}
            removeWrapper
            className="z-0 object-cover w-[300px]  h-[200px]"
            radius="lg"
            shadow="sm"
            src={img.src}
            width="100%"
          />
          <CardFooter className="absolute bg-black/50 bottom-0 border-t-1 border-zinc-100/50 z-10 text-white p-3 text-sm font-light justify-center text-center">
            <b>{text}</b>
          </CardFooter>
        </Card>
      </Link>
    </li>
  );
};

export default CatalogCard;
