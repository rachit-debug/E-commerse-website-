/** Format amounts as Indian Rupees (store/API still uses numeric values only). */
export function formatInr(amount) {
    const n = Number(amount);
    if (Number.isNaN(n)) return '—';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(n);
}
