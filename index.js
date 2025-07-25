import express from 'express';
import multer from 'multer';
import { extractImagesFromPDF } from 'pdf-image-extractor'; // See below
import fs from 'fs/promises';

const app = express();
const port = process.env.PORT || 3000;

// Memory storage (no folders)
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const buffer = req.file.buffer;

    const { images } = await extractImagesFromPDF(buffer);

    const base64Images = images.map(img =>
      img.data.toString('base64')
    );

    res.json({ images: base64Images });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to extract images from PDF');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
