import express from 'express';
import multer from 'multer';
import { extractImagesFromPdf } from 'pdf-extract-image';

const app = express();
const port = process.env.PORT || 3000;

// Use multer memory storage (no folder needed)
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    // Get PDF buffer from memory
    const pdfBuffer = req.file.buffer;

    // Extract images from the buffer
    const images = await extractImagesFromPdf(pdfBuffer);

    // Convert images to base64 strings
    const base64Images = images.map(img => img.toString('base64'));

    // Respond with base64 images
    res.json({ images: base64Images });
  } catch (error) {
    console.error('Error extracting images:', error);
    res.status(500).send('Failed to extract images from PDF');
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
