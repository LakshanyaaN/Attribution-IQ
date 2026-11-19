
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  createSession,
  verifySession,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  type AppRole,
} from '@/lib/auth';

export const runtime = 'nodejs';

function validOrigin(req: NextRequest) {
  const origin = req.headers.get('origin');
  return origin !== null && origin === req.nextUrl.origin;
}

export async function POST(req: NextRequest) {
  if (!validOrigin(req)) {
    return NextResponse.json(
      { success: false, error: 'Invalid request origin' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { email, password } = body ?? {};

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      email.length > 254 ||
      password.length > 1024
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const accounts: {
      email: string | undefined;
      hash: string | undefined;
      role: AppRole;
    }[] = [
      {
        email: process.env.AUTH_ANALYST_EMAIL,
        hash: process.env.AUTH_ANALYST_PASSWORD_HASH,
        role: 'analyst',
      },
      {
        email: process.env.AUTH_MANAGER_EMAIL,
        hash: process.env.AUTH_MANAGER_PASSWORD_HASH,
        role: 'manager',
      },
    ];

    const account = accounts.find(
      a => a.email?.toLowerCase() === email.trim().toLowerCase()
    );

    if (!account?.email || !account.hash) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, account.hash);

    if (!valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await createSession(account.email, account.role);

    const res = NextResponse.json({
      success: true,
      role: account.role,
      email: account.email,
    });

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });

    return res;
  } catch (error) {
    console.error('Authentication error:', error);

    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await verifySession(
    req.cookies.get(SESSION_COOKIE)?.value
  );

  if (!session) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    email: session.email,
    role: session.role,
  });
}

export async function DELETE(req: NextRequest) {
  if (!validOrigin(req)) {
    return NextResponse.json(
      { success: false, error: 'Invalid request origin' },
      { status: 403 }
    );
  }

  const res = NextResponse.json({ success: true });
  res.cookies.delete(SESSION_COOKIE);

  return res;
}
