import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  try {
    const url = req.query.url || req.url.split('?url=')[1];
    if (!url) return res.status(400).json({ error: "Falta el parámetro 'url'" });
    const info = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio').map(f => ({
      itag: f.itag,
      quality: f.qualityLabel || f.quality,
      container: f.container,
      contentType: f.mimeType,
      approxSize: f.contentLength || null,
      url: f.url
    }));
    res.status(200).json({
      source: 'youtube',
      title: info.videoDetails.title,
      author: info.videoDetails.author && info.videoDetails.author.name,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      duration: info.videoDetails.lengthSeconds,
      formats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
