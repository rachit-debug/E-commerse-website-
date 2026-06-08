import { memo, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCategoryById } from '../../api/category';
import { getProductsByCategory } from '../../api/product';
import { AppFooter } from '../../components/common/AppFooter';
import { AppHeader } from '../../components/common/AppHeader';
import { pageShellClass, primaryButtonClass } from '../../components/common/theme';
import { formatInr } from '../../utils/currency';
import { useCart } from '../../context/useCart';

const PLACEHOLDER_PRODUCT =
    'https://placehold.co/480x360/f1f5f9/64748b?text=Product';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const { addToCart } = useCart();
    const [addedId, setAddedId] = useState(null);
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const [cat, items] = await Promise.all([
                    getCategoryById(categoryId),
                    getProductsByCategory(categoryId),
                ]);
                if (!cancelled) {
                    setCategory(cat);
                    setProducts(Array.isArray(items) ? items : []);
                }
            } catch (e) {
                if (!cancelled) {
                    setError(e.message || 'Something went wrong');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        if (categoryId) load();
        return () => {
            cancelled = true;
        };
    }, [categoryId]);

    return (
        <div className={pageShellClass}>
            <AppHeader variant="category" />

            <div className="flex-1">
                <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
                    <nav className="mb-6 text-sm text-slate-500">
                        <Link to="/" className="hover:text-indigo-600">
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-slate-800">
                            {category?.title ?? 'Category'}
                        </span>
                    </nav>

                    {loading && (
                        <p className="text-slate-600">Loading products…</p>
                    )}
                    {error && (
                        <div
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    {!loading && !error && category && (
                        <>
                            <div className="mb-10 max-w-2xl">
                                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                                    {category.title}
                                </h1>
                                {category.description && (
                                    <p className="mt-3 text-lg leading-relaxed text-slate-600">
                                        {category.description}
                                    </p>
                                )}
                                <p className="mt-2 text-sm text-slate-500">
                                    {products.length}{' '}
                                    {products.length === 1 ? 'product' : 'products'}{' '}
                                    in this category
                                </p>
                            </div>

                            {products.length === 0 ? (
                                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center text-slate-600">
                                    No products in this category yet.
                                </p>
                            ) : (
                                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {products.map((product) => {
                                        const img =
                                            product.images?.[0] ||
                                            PLACEHOLDER_PRODUCT;
                                        return (
                                            <li
                                                key={product._id}
                                                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:border-indigo-200/80 hover:shadow-md hover:shadow-indigo-100/50"
                                            >
                                                <div className="aspect-4/3 overflow-hidden bg-slate-100">
                                                    <img
                                                        src={img}
                                                        alt={product.title}
                                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                                    />
                                                </div>
                                                <div className="flex flex-1 flex-col p-5">
                                                    <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                                                        {product.brand}
                                                    </p>
                                                    <h2 className="mt-1 font-semibold text-slate-900 line-clamp-2">
                                                        {product.title}
                                                    </h2>
                                                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-2">
                                                        {product.description}
                                                    </p>
                                                    <div className="mt-4 flex items-baseline gap-2">
                                                        <span className="text-lg font-semibold text-slate-900">
                                                            {formatInr(product.sellingPrice)}
                                                        </span>
                                                        {product.mrpPrice >
                                                            product.sellingPrice && (
                                                            <span className="text-sm text-slate-400 line-through">
                                                                {formatInr(product.mrpPrice)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            !product.stockQuantity
                                                        }
                                                        onClick={() => {
                                                            addToCart(product, 1);
                                                            setAddedId(product._id);
                                                            window.setTimeout(
                                                                () =>
                                                                    setAddedId(
                                                                        null
                                                                    ),
                                                                2000
                                                            );
                                                        }}
                                                        className={`${primaryButtonClass} mt-4 inline-flex w-full items-center justify-center text-sm disabled:pointer-events-none disabled:opacity-50`}
                                                    >
                                                        {!product.stockQuantity
                                                            ? 'Out of stock'
                                                            : addedId ===
                                                                product._id
                                                              ? 'Added ✓'
                                                              : 'Add to cart'}
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </>
                    )}
                </main>
            </div>

            <AppFooter />
        </div>
    );
};

export default memo(CategoryPage);
