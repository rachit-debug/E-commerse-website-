import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories } from '../../api/category';
import { AppFooter } from '../../components/common/AppFooter';
import { AppHeader } from '../../components/common/AppHeader';
import { pageShellClass } from '../../components/common/theme';

const PLACEHOLDER_CATEGORY =
    'https://placehold.co/640x400/e2e8f0/475569?text=Category';

const Homepage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllCategories()
            .then((data) => {
                setCategories(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error('Error fetching categories:', err);
                setError(
                    err.message || 'Could not load categories. Try signing in.'
                );
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className={pageShellClass}>
            <AppHeader variant="home" />

            <div className="flex-1">
                <section className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16 sm:pb-14">
                    <p className="text-sm font-medium uppercase tracking-widest text-indigo-600">
                        Curated for you
                    </p>
                    <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.1]">
                        Find your next favorite thing
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
                        Browse categories below — each collection is stocked with
                        products picked for quality and value.
                    </p>
                </section>

                <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
                    <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">
                                Shop by category
                            </h2>
                            <p className="mt-1 text-slate-600">
                                Tap a category to see everything we carry there.
                            </p>
                        </div>
                    </div>

                    {loading && (
                        <p className="text-slate-600">Loading categories…</p>
                    )}
                    {error && (
                        <div
                            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    {!loading && !error && categories.length === 0 && (
                        <p className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-6 py-10 text-center text-slate-600">
                            No categories available yet.
                        </p>
                    )}

                    {!loading && !error && categories.length > 0 && (
                        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {categories.map((category) => {
                                const imgSrc =
                                    category.imageUrl || PLACEHOLDER_CATEGORY;
                                return (
                                    <li key={category._id}>
                                        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50 transition hover:-translate-y-1 hover:border-indigo-200/90 hover:shadow-lg hover:shadow-indigo-100/60">
                                            <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                                                <img
                                                    src={imgSrc}
                                                    alt={category.title}
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-900/50 via-transparent to-transparent opacity-80" />
                                            </div>
                                            <div className="flex flex-1 flex-col p-6">
                                                <h3 className="text-xl font-semibold text-slate-900">
                                                    {category.title}
                                                </h3>
                                                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                                                    {category.description ||
                                                        'Explore products in this category.'}
                                                </p>
                                                <Link
                                                    to={`/category/${category._id}`}
                                                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                    Shop this category
                                                    <span
                                                        aria-hidden
                                                        className="transition group-hover:translate-x-0.5"
                                                    >
                                                        →
                                                    </span>
                                                </Link>
                                            </div>
                                        </article>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>
            </div>

            <AppFooter />
        </div>
    );
};

export default memo(Homepage);
