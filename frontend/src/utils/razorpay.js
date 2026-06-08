/** Load Razorpay checkout script once. */
export function loadRazorpayScript() {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('No window'));
            return;
        }
        if (window.Razorpay) {
            resolve(window.Razorpay);
            return;
        }
        const existing = document.querySelector(
            'script[data-razorpay-checkout]'
        );
        if (existing) {
            existing.addEventListener('load', () =>
                resolve(window.Razorpay)
            );
            existing.addEventListener('error', reject);
            return;
        }
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.async = true;
        s.dataset.razorpayCheckout = '1';
        s.onload = () => resolve(window.Razorpay);
        s.onerror = () => reject(new Error('Failed to load Razorpay'));
        document.body.appendChild(s);
    });
}
