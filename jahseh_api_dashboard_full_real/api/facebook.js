import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const url = req.query.url || req.url.split('?url=')[1];
    if (!url) return res.status(400).json({ error: "Falta el parámetro 'url'" });

    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await r.text();

    // Try to extract og meta tags
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr('content') || null;
    const thumbnail = $('meta[property="og:image"]').attr('content') || null;

    // Try to find playable_url in page
    const match = html.match(/"playable_url":"(.*?)"/);
    const video = match ? match[1].replace(/\\u0025/g, '%').replace(/\\u002F/g,'/') : null;

    res.json({ source: 'facebook', title, thumbnail, video_url: video ? decodeURIComponent(video) : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
