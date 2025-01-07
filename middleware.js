import { renderPage } from 'vite-plugin-ssr/server';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  try {
    const pageContextInit = {
      urlOriginal: request.nextUrl.pathname + request.nextUrl.search
    };

    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;

    if (!httpResponse) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const { body, statusCode, contentType } = httpResponse;
    const headers = new Headers();
    headers.set('Content-Type', contentType);

    return new NextResponse(body, {
      status: statusCode,
      headers
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)'
  ]
};
