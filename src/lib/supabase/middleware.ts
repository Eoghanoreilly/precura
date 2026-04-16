import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isProtected = path.startsWith('/member')
    && !path.startsWith('/member/login')
    && !path.startsWith('/member/auth')

  if (isProtected) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/member/login'
      return NextResponse.redirect(url)
    }
    if (!ALLOWED_EMAILS.includes(user.email?.toLowerCase() || '')) {
      const url = request.nextUrl.clone()
      url.pathname = '/member/login'
      url.searchParams.set('error', 'not_allowed')
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
