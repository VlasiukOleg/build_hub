import Script from 'next/script';

import AccordionCategories from '@/components/ui/Accordion/AccordionCategories';

import data from '@/data/common.json';

import { Pages } from '@/@types';

interface IPageProps {
  params: { slug: Pages };
}

// export const dynamicParams = false;
// export const dynamic = 'error';
// export const revalidate = false;

export function generateStaticParams() {
  return data.materialSlugs.map(slug => {
    return { slug };
  });
}

const Page: React.FC<IPageProps> = ({ params: { slug } }) => {
  return (
    <>
      <div>
        <AccordionCategories slug={slug} />
      </div>
    </>
  );
};

export default Page;
