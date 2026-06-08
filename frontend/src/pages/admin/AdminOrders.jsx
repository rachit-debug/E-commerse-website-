import { memo, useEffect, useState } from 'react';
import { getAdminOrders, updateAdminOrderStatus } from '../../api/order';
import { inputClass } from '../../components/common/theme';
import { formatInr } from '../../utils/currency';

const ORDER_STATUSES = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
];

function formatItems(items) {
    if (!items?.length) return '—';
    return items
        .map(
            (i) =>
                `${i.quantity}× ${i.title || i.product?.title || 'Item'}`
        )
        .join(', ');
}

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setLoadError(null);
            try {
                const data = await getAdminOrders();
                if (!cancelled) setOrders(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!cancelled) setLoadError(e.message || 'Failed to load orders');
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
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Orders
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    All customer orders (newest first).
                </p>
            </div>

            {loading && (
                <p className="text-slate-600">Loading orders…</p>
            )}
            {loadError && (
                <div
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800"
                    role="alert"
                >
                    {loadError}
                </div>
            )}

            {!loading && !loadError && orders.length === 0 && (
                <p className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-600">
                    No orders yet. They will appear here once checkout creates
                    records in the database.
                </p>
            )}

            {!loading && !loadError && orders.length > 0 && (
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    {updateError ? (
                        <div
                            className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                            role="alert"
                        >
                            {updateError}
                        </div>
                    ) : null}
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Order</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                    <th className="px-4 py-3">Items</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-800">
                                {orders.map((order) => (
                                    <tr key={order._id} className="bg-white">
                                        <td className="px-4 py-3 font-mono text-xs text-slate-500">
                                            {order._id.slice(-8)}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {order.createdAt
                                                ? new Date(
                                                      order.createdAt
                                                  ).toLocaleString()
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-900">
                                                {order.user?.name ?? '—'}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {order.user?.email ?? ''}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={order.status}
                                                disabled={updatingId === order._id}
                                                onChange={async (e) => {
                                                    const next = e.target.value;
                                                    if (next === order.status) {
                                                        return;
                                                    }
                                                    setUpdatingId(order._id);
                                                    setUpdateError(null);
                                                    try {
                                                        const updated =
                                                            await updateAdminOrderStatus(
                                                                order._id,
                                                                next
                                                            );
                                                        setOrders((prev) =>
                                                            prev.map((o) =>
                                                                o._id ===
                                                                updated._id
                                                                    ? updated
                                                                    : o
                                                            )
                                                        );
                                                    } catch (err) {
                                                        setUpdateError(
                                                            err.message ||
                                                                'Update failed'
                                                        );
                                                    } finally {
                                                        setUpdatingId(null);
                                                    }
                                                }}
                                                className={`${inputClass} min-w-[10rem] cursor-pointer py-2 text-sm capitalize disabled:opacity-50`}
                                                aria-label={`Order status for ${order._id.slice(-8)}`}
                                            >
                                                {ORDER_STATUSES.map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
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

export default memo(AdminOrders);
