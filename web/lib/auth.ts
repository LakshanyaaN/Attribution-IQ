
import { SignJWT, jwtVerify } from 'jose';

export type AppRole = 'analyst' | 'manager';

export const SESSION_COOKIE = 'attributioniq_auth';

const SESSION_DURATION = 60 * 60 * 8; // 8 hours

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SESSION_SECRET must be at least 32 characters');
  }

  return new TextEncoder().encode(secret);
}

export async function createSession(
  email: string,
  role: AppRole
): Promise<string> {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());
}

export async function verifySession(token?: string) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ['HS256'],
    });

    if (
      typeof payload.sub !== 'string' ||
      (payload.role !== 'analyst' && payload.role !== 'manager')
    ) {
      return null;
    }

    const expectedEmail =
      payload.role === 'analyst'
        ? process.env.AUTH_ANALYST_EMAIL
        : process.env.AUTH_MANAGER_EMAIL;

    if (
      !expectedEmail ||
      payload.sub.toLowerCase() !== expectedEmail.toLowerCase()
    ) {
      return null;
    }

    return {
      email: payload.sub,
      role: payload.role as AppRole,
    };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_DURATION;
