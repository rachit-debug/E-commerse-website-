import { authHeaders } from './authHeaders';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/categories`;

export const getAllCategories = async () => {
    const response = await fetch(`${BASE_URL}/get-all-categories`, {
        method: 'GET',
        headers: authHeaders(),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch categories');
    }

    return response.json();
};

export const getCategoryById = async (id) => {
    const response = await fetch(`${BASE_URL}/get-category/${id}`, {
        method: 'GET',
        headers: authHeaders(),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch category');
    }

    return response.json();
};

export async function getAdminCategories() {
    const response = await fetch(`${BASE_URL}/admin/all`, {
        method: 'GET',
        headers: authHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch categories');
    }
    return response.json();
}

export async function createCategory({ title, description, imageUrl }) {
    const response = await fetch(`${BASE_URL}/create-category`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ title, description, imageUrl }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create category');
    }
    return response.json().catch(() => ({}));
}

export async function updateCategory(id, { title, description, imageUrl }) {
    const response = await fetch(`${BASE_URL}/update-category/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ title, description, imageUrl }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update category');
    }
    return response.json().catch(() => ({}));
}

export async function deleteCategory(id) {
    const response = await fetch(`${BASE_URL}/delete-category/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to delete category');
    }
    return response.json().catch(() => ({}));
}
