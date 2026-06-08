import { memo, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    checkoutCod,
    createRazorpayOrder,
    verifyRazorpayCheckout,
} from '../../api/order';
import { fetchCurrentUser } from '../../api/user';
import { AppFooter } from '../../components/common/AppFooter';
import { AppHeader } from '../../components/common/AppHeader';
import {
    dangerTextClass,
    inputClass,
    labelClass,
    pageShellClass,
    primaryButtonClass,
    spinnerClass,
} from '../../components/common/theme';
import { useCart } from '../../context/useCart';
import { formatInr } from '../../utils/currency';
import { loadRazorpayScript } from '../../utils/razorpay';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, subtotal, clearCart } = useCart();
    const [shippingAddress, setShippingAddress] = useState('');
    const [payment, setPayment] = useState('cod');
    const [loadingUser, setLoadingUser] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const cartPayload = items.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
    }));

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const u = await fetchCurrentUser();
                if (!cancelled && u?.address) {
                    setShippingAddress(u.address);
                }
            } catch {
                /* optional */
            } finally {
                if (!cancelled) setLoadingUser(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart', { replace: true });
        }
    }, [items.length, navigate]);

    const handleCod = async () => {
        setSubmitting(true);
        setError(null);
        try {
            await checkoutCod({
                items: cartPayload,
                shippingAddress,
            });
            clearCart();
            navigate('/account/orders', { replace: true });
        } catch (e) {
            setError(e.message || 'Order failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRazorpay = async () => {
        setSubmitting(true);
        setError(null);
        try {
            const rp = await createRazorpayOrder({ items: cartPayload });
            const RazorpayCtor = await loadRazorpayScript();

            await new Promise((resolve, reject) => {
                const options = {
                    key: rp.keyId,
                    amount: rp.amount,
                    currency: rp.currency || 'INR',
                    order_id: rp.orderId,
                    name: 'Shop.',
                    description: 'Order payment',
                    handler: async (response) => {
                        try {
                            await verifyRazorpayCheckout({
                                items: cartPayload,
                                shippingAddress,
                                razorpay_order_id:
                                    response.razorpay_order_id,
                                razorpay_payment_id:
                                    response.razorpay_payment_id,
                                razorpay_signature:
                                    response.razorpay_signature,
                            });
                            clearCart();
                            navigate('/account/orders', { replace: true });
                            resolve();
                        } catch (err) {
                            reject(err);
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            reject(new Error('Payment cancelled'));
                        },
                    },
                    theme: { color: '#4F46E5' },
                };

                const rz = new RazorpayCtor(options);
                rz.on('payment.failed', () => {
                    reject(new Error('Payment failed'));
                });
                rz.open();
            });
        } catch (e) {
            if (e.message && !e.message.includes('cancelled')) {
                setError(e.message || 'Payment error');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!shippingAddress.trim()) {
            setError('Please enter a delivery address.');
            return;
        }
        if (payment === 'cod') {
            handleCod();
        } else {
            handleRazorpay();
        }
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <div className={pageShellClass}>
            <AppHeader variant="home" />
            <div className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Checkout
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Choose payment and confirm your delivery address.
                    </p>

                    <div className="mt-8 grid gap-8 lg:grid-cols-3">
                        <form
                            onSubmit={onSubmit}
                            className="space-y-6 lg:col-span-2"
                        >
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                                <h2 className="text-sm font-semibold text-slate-900">
                                    Delivery address
                                </h2>
                                <label
                                    htmlFor="ship-addr"
                                    className={`${labelClass} mt-4`}
                                >
                                    Full address
                                </label>
                                <textarea
                                    id="ship-addr"
                                    className={`${inputClass} min-h-[120px] resize-y`}
                                    value={shippingAddress}
                                    onChange={(e) =>
                                        setShippingAddress(e.target.value)
                                    }
                                    required
                                    placeholder="Street, city, PIN code…"
                                    disabled={loadingUser}
                                />
                            </div>

                            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                                <h2 className="text-sm font-semibold text-slate-900">
                                    Payment method
                                </h2>
                                <fieldset className="mt-4 space-y-3">
                                    <label
                                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                                            payment === 'cod'
                                                ? 'border-indigo-500 bg-indigo-50/50'
                                                : 'border-slate-200'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="pay"
                                            checked={payment === 'cod'}
                                            onChange={() => setPayment('cod')}
                                            className="mt-1 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span>
                                            <span className="font-medium text-slate-900">
                                                Cash on delivery (COD)
                                            </span>
                                            <span className="mt-0.5 block text-sm text-slate-600">
                                                Pay when your order arrives.
                                            </span>
                                        </span>
                                    </label>
                                    <label
                                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                                            payment === 'razorpay'
                                                ? 'border-indigo-500 bg-indigo-50/50'
                                                : 'border-slate-200'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="pay"
                                            checked={payment === 'razorpay'}
                                            onChange={() =>
                                                setPayment('razorpay')
                                            }
                                            className="mt-1 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span>
                                            <span className="font-medium text-slate-900">
                                                Razorpay (UPI, card, netbanking)
                                            </span>
                                            <span className="mt-0.5 block text-sm text-slate-600">
                                                Pay securely online via Razorpay.
                                            </span>
                                        </span>
                                    </label>
                                </fieldset>
                            </div>

                            {error ? (
                                <p className={dangerTextClass}>{error}</p>
                            ) : null}

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`${primaryButtonClass} inline-flex w-auto items-center justify-center px-8 disabled:opacity-60`}
                                >
                                    {submitting ? (
                                        <span
                                            className={spinnerClass}
                                            aria-hidden
                                        />
                                    ) : payment === 'cod' ? (
                                        'Place order (COD)'
                                    ) : (
                                        'Pay with Razorpay'
                                    )}
                                </button>
                                <Link
                                    to="/cart"
                                    className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                                >
                                    Back to cart
                                </Link>
                            </div>
                        </form>

                        <div className="h-fit rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                            <h2 className="text-sm font-semibold text-slate-900">
                                Order summary
                            </h2>
                            <ul className="mt-4 space-y-2 text-sm text-slate-600">
                                {items.map((l) => (
                                    <li
                                        key={l.productId}
                                        className="flex justify-between gap-2"
                                    >
                                        <span className="line-clamp-1">
                                            {l.title} × {l.quantity}
                                        </span>
                                        <span className="shrink-0 font-medium text-slate-900">
                                            {formatInr(
                                                l.unitPrice * l.quantity
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-base font-semibold text-slate-900">
                                <span>Total</span>
                                <span>{formatInr(subtotal)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <AppFooter />
        </div>
    );
};

export default memo(CheckoutPage);
