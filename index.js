import { extractImagesFromPdf } from 'pdf-extract-image';
import { writeFileSync } from 'fs';

async function main() {
  // const images = await extractImagesFromPdf(pdfBuffer);
  const images = await extractImagesFromPdf('/path/to/your.pdf');
  images.forEach((image, index) => {
    writeFileSync(`image${index}.png`, image);
  });
}

main().catch(console.error);
