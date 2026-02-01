import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('jwt')?.value
    const { pathname } = request.nextUrl

    // Protected routes
    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
    }

    // Auth routes (redirect to dashboard if already logged in)
    if (pathname.startsWith('/auth') && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/auth/:path*'],
}
