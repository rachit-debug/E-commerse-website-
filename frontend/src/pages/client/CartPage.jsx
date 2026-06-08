import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/useCart';
import { AppFooter } from '../../components/common/AppFooter';
import { AppHeader } from '../../components/common/AppHeader';
import { pageShellClass, primaryButtonClass } from '../../components/common/theme';
import { formatInr } from '../../utils/currency';
import { getToken } from '../../utils/auth';

const CartPage = () => {
    const { items, updateQuantity, removeItem, subtotal } = useCart();
    const loggedIn = !!getToken();

    return (
        <div className={pageShellClass}>
            <AppHeader variant="home" />
            <div className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Your cart
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Review items before checkout. Prices are confirmed at
                        payment.
                    </p>

                    {items.length === 0 ? (
                        <p className="mt-10 rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-600">
                            Your cart is empty.{' '}
                            <Link
                                to="/"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Continue shopping
                            </Link>
                        </p>
                    ) : (
                        <div className="mt-8 grid gap-8 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                                    {items.map((line) => (
                                        <li
                                            key={line.productId}
                                            className="flex gap-4 p-4 sm:p-5"
                                        >
                                            <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:size-24">
                                                {line.imageUrl ? (
                                                    <img
                                                        src={line.imageUrl}
                                                        alt=""
                                                        className="size-full object-cover"
                                                    />
                                                ) : null}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h2 className="font-semibold text-slate-900">
                                                    {line.title}
                                                </h2>
                                                <p className="mt-1 text-sm text-slate-600">
                                                    {formatInr(line.unitPrice)}{' '}
                                                    each
                                                </p>
                                                <div className="mt-3 flex flex-wrap items-center gap-3">
                                                    <label className="flex items-center gap-2 text-sm text-slate-600">
                                                        Qty
                                                        <select
                                                            value={line.quantity}
                                                            onChange={(e) =>
                                                                updateQuantity(
                                                                    line.productId,
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-900"
                                                        >
                                                            {Array.from(
                                                                {
                                                                    length: line.stockQuantity,
                                                                },
                                                                (_, i) => i + 1
                                                            ).map((n) => (
                                                                <option
                                                                    key={n}
                                                                    value={n}
                                                                >
                                                                    {n}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeItem(
                                                                line.productId
                                                            )
                                                        }
                                                        className="text-sm font-medium text-red-600 hover:text-red-500"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-slate-900">
                                                    {formatInr(
                                                        line.unitPrice *
                                                            line.quantity
                                                    )}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/"
                                    className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    ← Continue shopping
                                </Link>
                            </div>
                            <div className="h-fit rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                                <h2 className="text-sm font-semibold text-slate-900">
                                    Summary
                                </h2>
                                <p className="mt-4 flex justify-between text-sm text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-slate-900">
                                        {formatInr(subtotal)}
                                    </span>
                                </p>
                                {loggedIn ? (
                                    <Link
                                        to="/checkout"
                                        className={`${primaryButtonClass} mt-6 inline-flex w-full items-center justify-center text-center`}
                                    >
                                        Checkout
                                    </Link>
                                ) : (
                                    <Link
                                        to="/login"
                                        state={{ from: '/checkout' }}
                                        className={`${primaryButtonClass} mt-6 inline-flex w-full items-center justify-center text-center`}
                                    >
                                        Sign in to checkout
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <AppFooter />
        </div>
    );
};

export default memo(CartPage);
