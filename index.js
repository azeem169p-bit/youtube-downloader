const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();
app.use(cors());
app.get('/download', async (req, res) => {
  const URL = req.query.url;
  const format = req.query.format || 'video';
  if (!ytdl.validateURL(URL)) return res.status(400).send('Invalid URL');

  const info = await ytdl.getInfo(URL);
  const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

  res.header('Content-Disposition', `attachment; filename="${title}.${format === 'audio' ? 'mp3' : 'mp4'}"`);
  ytdl(URL, {
    filter: format === 'audio' ? 'audioonly' : 'videoandaudio',
    quality: format === 'audio' ? 'highestaudio' : 'highest',
  }).pipe(res);
});

app.get('/thumbnail', async (req, res) => {
  const URL = req.query.url;
  if (!ytdl.validateURL(URL)) return res.status(400).send('Invalid URL');
  const info = await ytdl.getInfo(URL);
  const thumbnail = info.videoDetails.thumbnails.pop().url;
  res.redirect(thumbnail);
});

app.listen(4000, () => console.log('Server running on port 4000'));