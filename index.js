import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { extractImagesFromPdf } from 'pdf-extract-image';

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const images = await extractImagesFromPdf(pdfPath);

    if (!images || images.length === 0) {
      return res.status(200).json({ message: 'No images found in PDF', images: [] });
    }

    const base64Images = images.map(img => img.toString('base64'));

    fs.unlink(pdfPath, (err) => {
      if (err) console.error('Failed to delete uploaded PDF:', err);
    });

    res.json({ images: base64Images });
  } catch (error) {
    console.error('Image extraction failed:', error);
    res.status(500).json({
      errorMessage: 'The service was not able to process your request',
      errorDescription: 'Failed to extract images'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
