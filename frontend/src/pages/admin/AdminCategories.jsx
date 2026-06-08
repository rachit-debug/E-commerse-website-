import { memo, useCallback, useEffect, useState } from 'react';
import {
    createCategory,
    deleteCategory,
    getAdminCategories,
    updateCategory,
} from '../../api/category';
import {
    inputClass,
    labelClass,
    primaryButtonClass,
} from '../../components/common/theme';
import { CloudinaryImagePicker } from '../../components/admin/CloudinaryImagePicker';

const emptyForm = { title: '', description: '', imageUrl: '' };

const AdminCategories = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        const data = await getAdminCategories();
        setList(Array.isArray(data) ? data : []);
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

    const startEdit = (cat) => {
        setEditingId(cat._id);
        setForm({
            title: cat.title,
            description: cat.description || '',
            imageUrl: cat.imageUrl || '',
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            if (editingId) {
                await updateCategory(editingId, form);
            } else {
                await createCategory(form);
            }
            resetForm();
            await load();
        } catch (err) {
            setError(err.message || 'Request failed');
        } finally {
            setSaving(false);
        }
    };

    const onDelete = async (cat) => {
        if (
            !window.confirm(
                `Delete category "${cat.title}"? It will be hidden from the storefront.`
            )
        ) {
            return;
        }
        setError(null);
        try {
            await deleteCategory(cat._id);
            if (editingId === cat._id) resetForm();
            await load();
        } catch (err) {
            setError(err.message || 'Delete failed');
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Categories
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Create, edit, or deactivate categories.
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
                    {editingId ? 'Edit category' : 'Add category'}
                </h2>
                <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label htmlFor="cat-title" className={labelClass}>
                            Title
                        </label>
                        <input
                            id="cat-title"
                            className={inputClass}
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="cat-desc" className={labelClass}>
                            Description
                        </label>
                        <textarea
                            id="cat-desc"
                            className={`${inputClass} min-h-[88px] resize-y`}
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            rows={3}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="cat-img" className={labelClass}>
                            Image URL
                        </label>
                        <input
                            id="cat-img"
                            type="url"
                            className={inputClass}
                            value={form.imageUrl}
                            onChange={(e) =>
                                setForm({ ...form, imageUrl: e.target.value })
                            }
                            placeholder="https://..."
                        />
                        <p className="mt-1.5 text-xs text-slate-500">
                            Paste a link, or upload from your computer (saved
                            to Cloudinary).
                        </p>
                        <div className="mt-3">
                            <CloudinaryImagePicker
                                disabled={saving}
                                onUploaded={(url) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        imageUrl: url,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 sm:col-span-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`${primaryButtonClass} w-auto px-6 disabled:opacity-60`}
                        >
                            {saving
                                ? 'Saving…'
                                : editingId
                                  ? 'Update category'
                                  : 'Add category'}
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

            {loading && <p className="text-slate-600">Loading categories…</p>}

            {!loading && (
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3">Active</th>
                                    <th className="px-4 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {list.map((cat) => (
                                    <tr key={cat._id}>
                                        <td className="px-4 py-3 font-medium text-slate-900">
                                            {cat.title}
                                        </td>
                                        <td className="max-w-xs px-4 py-3 text-slate-600">
                                            <span className="line-clamp-2">
                                                {cat.description || '—'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={
                                                    cat.isActive
                                                        ? 'text-emerald-600'
                                                        : 'text-slate-400'
                                                }
                                            >
                                                {cat.isActive ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(cat)}
                                                className="mr-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete(cat)}
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

export default memo(AdminCategories);
