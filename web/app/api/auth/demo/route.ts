
import { NextRequest, NextResponse } from 'next/server';
import {
  createSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  type AppRole,
} from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // Never allow passwordless demo login in production.
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Demo login unavailable' },
      { status: 403 }
    );
  }

  const origin = req.headers.get('origin');

  if (!origin || origin !== req.nextUrl.origin) {
    return NextResponse.json(
      { error: 'Invalid request origin' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const role = body?.role;

    if (role !== 'analyst' && role !== 'manager') {
      return NextResponse.json(
        { error: 'Invalid demo account' },
        { status: 400 }
      );
    }

    const selectedRole = role as AppRole;

    const email =
      selectedRole === 'analyst'
        ? process.env.AUTH_ANALYST_EMAIL
        : process.env.AUTH_MANAGER_EMAIL;

    if (!email) {
      return NextResponse.json(
        { error: 'Demo account not configured' },
        { status: 500 }
      );
    }

    const token = await createSession(email, selectedRole);

    const res = NextResponse.json({
      success: true,
      role: selectedRole,
      email,
    });

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: 'Demo login failed' },
      { status: 500 }
    );
  }
}
