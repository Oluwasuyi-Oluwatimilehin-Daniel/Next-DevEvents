#!/usr/bin/env node
/* eslint-disable */
const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary inline
cloudinary.config({
  cloud_name: 'gejleiku',
  api_key: '922549147381116',
  api_secret: '7QHySPgR0wDpMT4jRYIKL45iAtY'
});

async function run() {
  try {
    const imageUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    console.log('Uploading image...');
    
    // 2. Upload the image
    const uploadResult = await cloudinary.uploader.upload(imageUrl);
    console.log('Secure URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);
    
    // 3. Get image details (metadata)
    console.log('--- Image Details ---');
    console.log('Width:', uploadResult.width);
    console.log('Height:', uploadResult.height);
    console.log('Format:', uploadResult.format);
    console.log('File size (bytes):', uploadResult.bytes);
    
    // 4. Transform the image
    // Generating a transformed version of the image URL using f_auto and q_auto
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      secure: true,
      // f_auto: Automatically delivers the image in the most optimal format (e.g. WebP/AVIF) supported by the browser
      fetch_format: 'auto',
      // q_auto: Automatically optimizes image quality and compression level based on the image content and viewing device
      quality: 'auto'
    });
    
    console.log('\nDone! Click link below to see optimized version of the image. Check the size and the format.');
    console.log(transformedUrl);
  } catch (error) {
    console.error('Error during Cloudinary onboarding flow:', error);
  }
}

run();
