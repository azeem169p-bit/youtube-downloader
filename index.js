
const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

app.use(cors());

app.get('/api/video', async (req, res) => {
  const url = req.query.url;
  if (!ytdl.validateURL(url)) return res.status(400).send('Invalid URL');
  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  ytdl(url, { quality: 'highestvideo' }).pipe(res);
});

app.get('/api/audio', async (req, res) => {
  const url = req.query.url;
  if (!ytdl.validateURL(url)) return res.status(400).send('Invalid URL');
  res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
  ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
});

app.get('/api/thumbnail', async (req, res) => {
  const url = req.query.url;
  if (!ytdl.validateURL(url)) return res.status(400).send('Invalid URL');
  const info = await ytdl.getInfo(url);
  const thumb = info.videoDetails.thumbnails.pop().url;
  res.redirect(thumb);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
