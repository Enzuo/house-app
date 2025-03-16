import * as fs from 'fs'
import * as path from 'path'

import { PATH_IMG } from '@/logic/constants.js';

export async function GET({ params }) {
  const { filename, folder } = params;

  console.log('get image', folder, filename);

  // Specify the base directory where your images are located
  const filePath = path.join(PATH_IMG, folder, filename);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return new Response('File not found', { status: 404 });
  }

  // Read the file
  const fileBuffer = fs.readFileSync(filePath);

  // Determine the MIME type based on the file extension
  const mimeType = getMimeType(filePath);

  return new Response(fileBuffer, {
    headers: {
      'Content-Type': mimeType
    }
  });
}



// Helper function to get the MIME type
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}