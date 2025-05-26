// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const response = NextResponse.next();
//   const host = request.headers.get('host') || '';
//   let city = 'kiev';
//   if (host.startsWith('lviv.')) city = 'lviv';
//   response.headers.set('x-city', city);
//   return response;
// }

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const url = request.nextUrl.clone();
//   const host = request.headers.get('host') || '';

//   // Определяем город по поддомену
//   let city = 'kiev'; // по умолчанию
//   if (host.startsWith('lviv.')) city = 'lviv';

//   // Добавляем город в куки или заголовки
//   url.searchParams.set('city', city);
//   const response = NextResponse.rewrite(url);

//   // Можно сохранить город в куки (если нужен на клиенте)
//   response.cookies.set('city', city);
  
//   return response;
// }

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const host = request.headers.get('host') || '';
  let city = 'kiev';
  if (host.startsWith('lviv.')) city = 'lviv';

  response.cookies.set('city', city);
  return response;
}