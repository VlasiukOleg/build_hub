import StorageMap from '@/components/common/StorageMap';

import Script from 'next/script';

export default function Home() {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-EEGRJKT26X"
      ></Script>
      <Script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EEGRJKT26X');
            `,
        }}
      />
      <div className="container">
        <StorageMap />
      </div>
    </>
  );
}
