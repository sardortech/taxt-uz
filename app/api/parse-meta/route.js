import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL kiritilmadi' }, { status: 400 });
  }

  try {
    let fetchUrl = targetUrl;
    // Telegram kanallar/guruhlar uchun HTML preview sahifasi (t.me/s/...)
    if (targetUrl.includes('t.me/') && !targetUrl.includes('t.me/s/')) {
      fetchUrl = targetUrl.replace('t.me/', 't.me/s/');
    }

    const res = await fetch(fetchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const html = await res.text();

    // og:image, og:title va og:description teglarini HTML ichidan qidirib topish
    const imageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) || 
                       html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
    const titleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                       html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i);
    const descMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
                      html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:description["']/i);

    return NextResponse.json({
      image: imageMatch ? imageMatch[1] : null,
      title: titleMatch ? titleMatch[1] : null,
      description: descMatch ? descMatch[1] : null
    });
  } catch (error) {
    return NextResponse.json({ error: 'Maalumat olib bo\'lmadi' }, { status: 500 });
  }
}