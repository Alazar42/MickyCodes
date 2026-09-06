export default async function handler(req: any, res: any) {
  try {
    const response = await fetch('https://t.me/s/MickyCodes', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Telegram returned status ${response.status}`);
    }

    const html = await response.text();

    // Extract post IDs
    const postRegex = /data-post="MickyCodes\/(\d+)"/g;
    const postIds = new Set<number>();
    let match: RegExpExecArray | null;
    while ((match = postRegex.exec(html)) !== null) {
      postIds.add(parseInt(match[1], 10));
    }

    const sortedIds = Array.from(postIds).sort((a, b) => a - b);
    const latest3Ids = sortedIds.slice(-3).reverse();

    // Extract channel metadata
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/);
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    const subsMatch =
      html.match(/<div class="tgme_header_counter">([^<]+)<\/div>/) ||
      html.match(/<span class="counter_value">([^<]+)<\/span>\s*<span class="counter_type">subscribers<\/span>/);

    const channel = {
      title: titleMatch ? titleMatch[1] : 'Micky Codes',
      username: 'MickyCodes',
      link: 'https://t.me/MickyCodes',
      description: descMatch
        ? descMatch[1].replace(/&#39;/g, "'").replace(/&amp;/g, '&')
        : "Software engineer | Game developer\nLet's explore the coding world.",
      image: imageMatch
        ? imageMatch[1]
        : '',
      subscribers: subsMatch ? subsMatch[1] : '290+ subscribers',
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    );

    return res.status(200).json({
      ok: true,
      channel,
      postIds: latest3Ids,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Failed to scrape Telegram channel:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Failed to fetch Telegram feed',
      postIds: [675, 674, 673], // Graceful fallback
    });
  }
}
