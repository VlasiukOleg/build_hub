'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GTMPageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'pageview',
        page: pathname,
      });
    }
  }, [pathname]);

  return null;
}
