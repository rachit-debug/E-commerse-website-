import { getToken } from '../utils/auth';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/upload`;

/**
 * Upload an image file to Cloudinary (admin only). Returns secure HTTPS URL.
 * @param {File} file
 */
export async function uploadImageToCloudinary(file) {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${BASE_URL}/image`, {
        method: 'POST',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Upload failed');
    }

    return response.json();
}
