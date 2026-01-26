import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const url = req.query.url || req.url.split('?url=')[1];
    if (!url) return res.status(400).json({ error: "Falta el parámetro 'url'" });

    // Try public API (may change over time)
    const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const r = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const data = await r.json();

    if (!data || !data.data) {
      return res.status(500).json({ error: 'No se pudo obtener datos de TikTok' });
    }

    res.json({
      source: 'tiktok',
      title: data.data.title,
      author: data.data.nickname,
      thumbnail: data.data.cover,
      video_url: data.data.play, // no watermark
      music_url: data.data.music
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
