import { authHeaders } from './authHeaders';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/orders`;

export async function getAdminOrders() {
    const response = await fetch(`${BASE_URL}/admin/all`, {
        method: 'GET',
        headers: authHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch orders');
    }
    return response.json();
}

export async function updateAdminOrderStatus(orderId, status) {
    const response = await fetch(`${BASE_URL}/admin/${orderId}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update order');
    }
    return response.json();
}

export async function getMyOrders() {
    const response = await fetch(`${BASE_URL}/my`, {
        method: 'GET',
        headers: authHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch your orders');
    }
    return response.json();
}

export async function checkoutCod({ items, shippingAddress }) {
    const response = await fetch(`${BASE_URL}/checkout/cod`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ items, shippingAddress }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Checkout failed');
    }
    return response.json().catch(() => ({}));
}

export async function createRazorpayOrder({ items }) {
    const response = await fetch(
        `${BASE_URL}/checkout/razorpay/create-order`,
        {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ items }),
        }
    );
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Could not start payment');
    }
    return response.json();
}

export async function verifyRazorpayCheckout(payload) {
    const response = await fetch(`${BASE_URL}/checkout/razorpay/verify`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Payment verification failed');
    }
    return response.json().catch(() => ({}));
}
