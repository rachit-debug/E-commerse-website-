import { memo, useEffect, useState } from 'react';
import { getMyOrders } from '../../api/order';
import { formatInr } from '../../utils/currency';

const statusStyles = {
    pending: 'bg-amber-100 text-amber-900',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-violet-100 text-violet-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-slate-200 text-slate-700',
};

function formatItems(items) {
    if (!items?.length) return '—';
    return items
        .map(
            (i) =>
                `${i.quantity}× ${i.title || i.product?.title || 'Item'}`
        )
        .join(', ');
}

const AccountOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getMyOrders();
                if (!cancelled) setOrders(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!cancelled) setError(e.message || 'Failed to load orders');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                My orders
            </h1>
            <p className="mt-1 text-sm text-slate-600">
                Orders placed with your account.
            </p>

            {loading && (
                <p className="mt-8 text-slate-600">Loading your orders…</p>
            )}
            {error && (
                <div
                    className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {!loading && !error && orders.length === 0 && (
                <p className="mt-8 rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-600">
                    You don&apos;t have any orders yet.
                </p>
            )}

            {!loading && !error && orders.length > 0 && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Order</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                    <th className="px-4 py-3">Items</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-800">
                                {orders.map((order) => (
                                    <tr key={order._id} className="bg-white">
                                        <td className="px-4 py-3 font-mono text-xs text-slate-500">
                                            …{order._id.slice(-8)}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {order.createdAt
                                                ? new Date(
                                                      order.createdAt
                                                  ).toLocaleString()
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                                    statusStyles[order.status] ||
                                                    'bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                            {formatInr(order.totalAmount)}
                                        </td>
                                        <td className="max-w-xs px-4 py-3 text-slate-600">
                                            <span className="line-clamp-2">
                                                {formatItems(order.items)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(AccountOrders);
