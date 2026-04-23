import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

// Routes under /member/* that do NOT require auth
const MEMBER_PUBLIC = (path: string) =>
  path.startsWith('/member/login') || path.startsWith('/member/auth')

// Routes under /doctor/* that do NOT require auth
// /doctor/concepts/* are design artefacts, publicly viewable
const DOCTOR_PUBLIC = (path: string) =>
  path.startsWith('/doctor/login') ||
  path.startsWith('/doctor/auth') ||
  path.startsWith('/doctor/concepts')

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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  const isDoctorArea = path.startsWith('/doctor') && !DOCTOR_PUBLIC(path)
  const isMemberArea = path.startsWith('/member') && !MEMBER_PUBLIC(path)

  // --- Unauthenticated gates ---
  if (isDoctorArea && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/doctor/login'
    return NextResponse.redirect(url)
  }
  if (isMemberArea && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/member/login'
    return NextResponse.redirect(url)
  }

  // --- Allowlist + role gates for authenticated users ---
  if ((isDoctorArea || isMemberArea) && user) {
    const userEmail = user.email?.toLowerCase() || ''
    if (!ALLOWED_EMAILS.includes(userEmail)) {
      const url = request.nextUrl.clone()
      url.pathname = isDoctorArea ? '/doctor/login' : '/member/login'
      url.searchParams.set('error', 'not_allowed')
      return NextResponse.redirect(url)
    }

    // Fetch role for route-vs-role mismatch handling
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role: 'patient' | 'doctor' | 'both' | undefined = profile?.role

    if (isDoctorArea) {
      // Doctor area requires doctor or both
      if (role !== 'doctor' && role !== 'both') {
        const url = request.nextUrl.clone()
        url.pathname = '/member'
        return NextResponse.redirect(url)
      }
    }

    if (isMemberArea) {
      // Member area: strict doctors get sent to /doctor
      // 'both' and 'patient' stay on /member
      if (role === 'doctor') {
        const url = request.nextUrl.clone()
        url.pathname = '/doctor'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
