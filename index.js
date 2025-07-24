const express = require('express');
const multer = require('multer');
const extract = require('pdf-extract-image');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/extract-images', upload.single('pdf'), async (req, res) => {
  if (!req.file) return res.status(400).send({ error: 'No file uploaded' });

  try {
    const outputDir = path.join(__dirname, 'outputs');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const images = await extract(req.file.path, { outputDir });

    const base64Images = images.map((imgPath) => {
      const imgData = fs.readFileSync(imgPath);
      return {
        name: path.basename(imgPath),
        data: imgData.toString('base64'),
      };
    });

    res.json({ images: base64Images });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to extract images' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port 3000');
});