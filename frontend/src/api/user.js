import { authHeaders } from './authHeaders';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/users`;

export async function fetchCurrentUser() {
    const response = await fetch(`${BASE_URL}/get-user-by-id`, {
        method: 'GET',
        headers: authHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to load profile');
    }
    const data = await response.json();
    return data.user;
}

export async function updateUserProfile({ name, phoneNumber, address }) {
    const response = await fetch(`${BASE_URL}/update-user`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ name, phoneNumber, address }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update profile');
    }
    const data = await response.json();
    return data.user;
}
