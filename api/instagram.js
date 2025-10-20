import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const url = req.query.url || req.url.split('?url=')[1];
    if (!url) return res.status(400).json({ error: "Falta el parámetro 'url'" });

    // Try simple oEmbed first
    try {
      const oembed = await fetch(`https://graph.facebook.com/v8.0/instagram_oembed?url=${encodeURIComponent(url)}`);
      if (oembed.ok) {
        const jo = await oembed.json();
        return res.json({ source: 'instagram', title: jo.title || null, thumbnail: jo.thumbnail_url || null, type: jo.type || null });
      }
    } catch(e){ /* continue to scraping */ }

    // Fallback: fetch page and scrape JSON-LD
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await r.text();
    const $ = cheerio.load(html);
    const script = $('script[type="application/ld+json"]').html();
    if (script) {
      const j = JSON.parse(script);
      return res.json({ source: 'instagram', title: j.name || null, thumbnail: j.thumbnailUrl || null, video: j.contentUrl || null });
    }

    res.status(500).json({ error: 'No se encontró metadata de Instagram' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
