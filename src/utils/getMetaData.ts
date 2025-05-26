
import { Metadata } from 'next';
import configuration from './configuration';

import { metaData } from '@/data';

export const getMetadata = (host?: string): Metadata => {
  const isLviv = host?.includes('lviv.');
  
  return {
    metadataBase: new URL(configuration.BASE_APP_URL as string),
    title: isLviv 
      ? metaData.lvivTitle 
      : metaData.mainTitle,
    description: metaData.description,
    keywords: metaData.keywords,
    icons: metaData.icons,
    openGraph: {
      type: 'website',
      url: configuration.BASE_APP_URL,
      title: isLviv 
        ? metaData.ogLvivTitle 
        : metaData.ogTitle,
      description: metaData.ogDescription,
      siteName: 'LUM',
      images: [
      {
        url: metaData.image.url,
        width: 1200,
        height: 630,
        alt: metaData.image.alt,
      },
    ],
    },
    other: {
      'color-scheme': 'light',
      'google-site-verification': 'yAtp8bFM4TUmCzO4O51gsBFznWK-H-U5B_fD3YKY84Q',
    },
  };
};