import clsx from 'clsx';

import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { Montserrat } from 'next/font/google';
import './globals.css';

import { Providers } from '../provider';
import Header from '@/layout/Header';
import Footer from '@/layout/Footer/Footer';
import CityInitializer from '@/components/common/CityInitializer';

import { getMetadata } from '@/utils/getMetaData';

import StoreProvider from './StoreProvider';
import GTMPageViewTracker from '../gtmTracker';

import { GoogleTagManager } from '@next/third-parties/google';

export async function generateMetadata(): Promise<Metadata> {
  const host = headers().get('host') || '';
  return getMetadata(host);
}

const montserrat = Montserrat({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = headers().get('host') || '';

  const citySubDomain = host.split('.')[0]; // "lviv"

  const city = citySubDomain === 'lviv' ? citySubDomain : 'kiev';

  return (
    <html lang="uk">
      <GoogleTagManager gtmId="GTM-KXTW9BD9" />
      <body className={clsx(montserrat.className)}>
        <StoreProvider>
          <CityInitializer city={city} />
          <Providers>
            <GTMPageViewTracker />
            <div className="flex flex-col h-full min-h-screen">
              <Header />
              <main className="flex-1 flex items-center justify-center">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
