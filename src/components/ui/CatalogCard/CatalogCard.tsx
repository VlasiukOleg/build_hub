import Link from 'next/link';
import { StaticImageData } from 'next/image';
import { Card, CardFooter, Image } from '@heroui/react';

interface ICatalogCardProps {
  id: number;
  img: StaticImageData;
  text: string;
  href: string;
}

const CataogCard: React.FunctionComponent<ICatalogCardProps> = ({
  id,
  img,
  text,
  href,
}) => {
  return (
    <li>
      <Link href={`catalog/${href}`}>
        <Card
          isFooterBlurred
          key={id}
          shadow="sm"
          className="border-2 border-accent"
        >
          <Image
            alt={text}
            className="object-cover w-[300px]  h-[200px]"
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

export default CataogCard;
