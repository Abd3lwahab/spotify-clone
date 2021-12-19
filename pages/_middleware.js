import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET })
  const { pathname } = req.nextUrl

  console.log('PATHNAME IS', pathname)
  console.log('TOKEN IS', token)

  // If user is logged in, redirect to home
  if (token && pathname === '/login') {
    return NextResponse.redirect('/')
  }

  // Allow requests if the following is true...
  // 1) A token exists
  // 2) Its a request for next-auth session & provider fetching
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  // Redirect them to login if they dont have token AND are requesting a protected route
  // if (!token && pathname !== '/login') {
  //   return NextResponse.redirect('/login')
  // }
}
