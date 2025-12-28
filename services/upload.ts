/**
 * Uploads an image to Cloudinary using the Unsigned Upload method.
 * 
 * SETUP INSTRUCTIONS FOR USER:
 * 1. Go to https://cloudinary.com/console
 * 2. Get your "Cloud Name" from the dashboard.
 * 3. Go to Settings > Upload > Upload presets.
 * 4. Create a new preset:
 *    - Name: "swiftcart_unsigned" (or similar)
 *    - Signing Mode: "Unsigned" (CRITICAL!)
 * 5. Paste the Cloud Name and Preset below.
 */

// REPLACE THESE WITH YOUR CLOUDINARY CREDENTIALS
const CLOUD_NAME = 'dqjtfpebn';
const UPLOAD_PRESET = 'swiftstore';

export const uploadImage = async (file: File, folder: string = 'swiftcart'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder); // Optional: organize files

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();
        console.log('Upload successful:', data);
        return data.secure_url; // Returns the HTTPS URL of the uploaded image
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};
