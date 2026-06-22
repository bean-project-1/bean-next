import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { apiKey, provider } = await req.json();

    if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 10) {
      return NextResponse.json({ error: 'Formato de API Key inválido.' }, { status: 400 });
    }

    const validProviders = ['openai', 'deepseek', 'gemini'];
    const selectedProvider = validProviders.includes(provider) ? provider : 'openai';

    // Set the cookie
    // HttpOnly and Secure ensure the cookie isn't readable by JS and is only sent over HTTPS (in prod)
    const cookieStore = await cookies();
    cookieStore.set('bean_byok_key', apiKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    cookieStore.set('bean_byok_provider', selectedProvider, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[POST /api/profile/api-key]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.delete('bean_byok_key');
    cookieStore.delete('bean_byok_provider');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE /api/profile/api-key]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
