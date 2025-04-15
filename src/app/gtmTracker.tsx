'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GTMPageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];

      // Специальное событие только для каталога
      if (pathname === '/catalog') {
        window.dataLayer.push({
          event: 'catalog',
          page: pathname,
        });
      }
    }
  }, [pathname]);

  return null;
}
