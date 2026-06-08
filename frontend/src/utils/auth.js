/** Raw JWT string from localStorage (handles JSON-wrapped tokens). */
export function getToken() {
    const raw = localStorage.getItem('token');
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'string') return parsed;
    } catch {
        /* plain string token */
    }
    return raw;
}

/** Decode JWT payload (no signature verification — server enforces access). */
export function parseJwtPayload(token) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
        let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64.length % 4;
        if (pad) base64 += '='.repeat(4 - pad);
        const json = atob(base64);
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function isAdmin() {
    const payload = parseJwtPayload(getToken());
    return payload?.role === 'admin';
}
