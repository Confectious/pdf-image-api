import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { extractImagesFromPdf } from 'pdf-extract-image';
import { writeFileSync } from 'fs';

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });
async function main() {
  // const images = await extractImagesFromPdf(pdfBuffer);
  const images = await extractImagesFromPdf('/path/to/your.pdf');
  images.forEach((image, index) => {
    writeFileSync(`image${index}.png`, image);
  });
}

app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const images = await extractImagesFromPdf(pdfPath);

    const base64Images = images.map(img => img.toString('base64'));
    res.json({ images: base64Images });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to extract images');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
main().catch(console.error);
