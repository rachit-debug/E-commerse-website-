import { authHeaders } from './authHeaders';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/products`;

export const getProductsByCategory = async (categoryId) => {
    const response = await fetch(
        `${BASE_URL}/get-all-products-by-category/${categoryId}`,
        {
            method: 'GET',
            headers: authHeaders(),
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch products');
    }

    return response.json();
};

export async function getAdminProducts() {
    const response = await fetch(`${BASE_URL}/admin/all`, {
        method: 'GET',
        headers: authHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch products');
    }
    return response.json();
}

export async function createProduct(body) {
    const response = await fetch(`${BASE_URL}/create-product`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create product');
    }
    return response.json().catch(() => ({}));
}

export async function updateProduct(id, body) {
    const response = await fetch(`${BASE_URL}/update-product/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update product');
    }
    return response.json().catch(() => ({}));
}

export async function deleteProduct(id) {
    const response = await fetch(`${BASE_URL}/delete-product/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to delete product');
    }
    return response.json().catch(() => ({}));
}
