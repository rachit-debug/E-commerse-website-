import { memo, useCallback, useEffect, useState } from 'react';
import { getAdminCategories } from '../../api/category';
import {
    createProduct,
    deleteProduct,
    getAdminProducts,
    updateProduct,
} from '../../api/product';
import {
    inputClass,
    labelClass,
    primaryButtonClass,
} from '../../components/common/theme';
import { CloudinaryImagePicker } from '../../components/admin/CloudinaryImagePicker';
import { formatInr } from '../../utils/currency';

const emptyForm = {
    title: '',
    description: '',
    mrpPrice: '',
    sellingPrice: '',
    imagesStr: '',
    category: '',
    stockQuantity: '',
    rating: '',
    noOfRatings: '',
    brand: '',
};

const AdminProducts = () => {
    const [list, setList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        const [products, cats] = await Promise.all([
            getAdminProducts(),
            getAdminCategories(),
        ]);
        setList(Array.isArray(products) ? products : []);
        setCategories(Array.isArray(cats) ? cats : []);
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                await load();
            } catch (e) {
                if (!cancelled) setError(e.message || 'Failed to load');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [load]);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const startEdit = (p) => {
        setEditingId(p._id);
        setForm({
            title: p.title,
            description: p.description,
            mrpPrice: String(p.mrpPrice),
            sellingPrice: String(p.sellingPrice),
            imagesStr: (p.images || []).join(', '),
            category: p.category?._id || p.category || '',
            stockQuantity: String(p.stockQuantity ?? 0),
            rating: String(p.rating ?? 0),
            noOfRatings: String(p.noOfRatings ?? 0),
            brand: p.brand || '',
        });
    };

    const buildBody = () => {
        const images = form.imagesStr
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        return {
            title: form.title,
            description: form.description,
            mrpPrice: Number(form.mrpPrice),
            sellingPrice: Number(form.sellingPrice),
            images,
            category: form.category,
            stockQuantity: Number(form.stockQuantity) || 0,
            rating: Number(form.rating) || 0,
            noOfRatings: Number(form.noOfRatings) || 0,
            brand: form.brand,
        };
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const body = buildBody();
            if (editingId) {
                await updateProduct(editingId, body);
            } else {
                await createProduct(body);
            }
            resetForm();
            await load();
        } catch (err) {
            setError(err.message || 'Request failed');
        } finally {
            setSaving(false);
        }
    };

    const onDelete = async (p) => {
        if (
            !window.confirm(
                `Remove "${p.title}" from the storefront? (soft delete)`
            )
        ) {
            return;
        }
        setError(null);
        try {
            await deleteProduct(p._id);
            if (editingId === p._id) resetForm();
            await load();
        } catch (err) {
            setError(err.message || 'Delete failed');
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Products
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Manage catalog items, pricing, and inventory.
                </p>
            </div>

            {error && (
                <div
                    className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800"
                    role="alert"
                >
                    {error}
                </div>
            )}

            <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-slate-900">
                    {editingId ? 'Edit product' : 'Add product'}
                </h2>
                <form
                    onSubmit={onSubmit}
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <div className="lg:col-span-2">
                        <label htmlFor="p-title" className={labelClass}>
                            Title
                        </label>
                        <input
                            id="p-title"
                            className={inputClass}
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="p-brand" className={labelClass}>
                            Brand
                        </label>
                        <input
                            id="p-brand"
                            className={inputClass}
                            value={form.brand}
                            onChange={(e) =>
                                setForm({ ...form, brand: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                        <label htmlFor="p-desc" className={labelClass}>
                            Description
                        </label>
                        <textarea
                            id="p-desc"
                            className={`${inputClass} min-h-[88px] resize-y`}
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            required
                            rows={3}
                        />
                    </div>
                    <div>
                        <label htmlFor="p-mrp" className={labelClass}>
                            MRP (₹)
                        </label>
                        <input
                            id="p-mrp"
                            type="number"
                            min="0"
                            step="0.01"
                            className={inputClass}
                            value={form.mrpPrice}
                            onChange={(e) =>
                                setForm({ ...form, mrpPrice: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="p-price" className={labelClass}>
                            Selling price (₹)
                        </label>
                        <input
                            id="p-price"
                            type="number"
                            min="0"
                            step="0.01"
                            className={inputClass}
                            value={form.sellingPrice}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    sellingPrice: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="p-stock" className={labelClass}>
                            Stock
                        </label>
                        <input
                            id="p-stock"
                            type="number"
                            min="0"
                            className={inputClass}
                            value={form.stockQuantity}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    stockQuantity: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="p-cat" className={labelClass}>
                            Category
                        </label>
                        <select
                            id="p-cat"
                            className={inputClass}
                            value={form.category}
                            onChange={(e) =>
                                setForm({ ...form, category: e.target.value })
                            }
                            required
                        >
                            <option value="">Select…</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.title}
                                    {!c.isActive ? ' (inactive)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="p-rating" className={labelClass}>
                            Rating (0–5)
                        </label>
                        <input
                            id="p-rating"
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            className={inputClass}
                            value={form.rating}
                            onChange={(e) =>
                                setForm({ ...form, rating: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="p-nor" className={labelClass}>
                            # Ratings
                        </label>
                        <input
                            id="p-nor"
                            type="number"
                            min="0"
                            className={inputClass}
                            value={form.noOfRatings}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    noOfRatings: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                        <label htmlFor="p-img" className={labelClass}>
                            Image URLs (comma-separated)
                        </label>
                        <input
                            id="p-img"
                            className={inputClass}
                            value={form.imagesStr}
                            onChange={(e) =>
                                setForm({ ...form, imagesStr: e.target.value })
                            }
                            placeholder="https://..., https://..."
                        />
                        <p className="mt-1.5 text-xs text-slate-500">
                            Add URLs manually, or upload files — each upload is
                            appended to this list (Cloudinary).
                        </p>
                        <div className="mt-3">
                            <CloudinaryImagePicker
                                disabled={saving}
                                label="Upload image to gallery"
                                onUploaded={(url) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        imagesStr: prev.imagesStr.trim()
                                            ? `${prev.imagesStr.trim()}, ${url}`
                                            : url,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`${primaryButtonClass} w-auto px-6 disabled:opacity-60`}
                        >
                            {saving
                                ? 'Saving…'
                                : editingId
                                  ? 'Update product'
                                  : 'Add product'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {loading && <p className="text-slate-600">Loading products…</p>}

            {!loading && (
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="px-4 py-3">Brand</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3 text-right">Price</th>
                                    <th className="px-4 py-3">Stock</th>
                                    <th className="px-4 py-3">Active</th>
                                    <th className="px-4 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {list.map((p) => (
                                    <tr key={p._id}>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-900">
                                                {p.title}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {p.brand}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {p.category?.title ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium text-slate-900">
                                            {formatInr(p.sellingPrice)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {p.stockQuantity}
                                        </td>
                                        <td className="px-4 py-3">
                                            {p.isActive ? (
                                                <span className="text-emerald-600">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(p)}
                                                className="mr-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete(p)}
                                                className="text-sm font-medium text-red-600 hover:text-red-500"
                                            >
                                                Delete
                                            </button>
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

export default memo(AdminProducts);
