import { NavLink, Outlet, Link } from 'react-router-dom';

const itemClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        isActive
            ? 'bg-indigo-600 text-white'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

export function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-slate-100">
            <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-white">
                <div className="border-b border-slate-800 p-4">
                    <Link
                        to="/admin/orders"
                        className="text-lg font-semibold tracking-tight text-white"
                    >
                        Shop<span className="text-indigo-400">.</span>
                        <span className="ml-2 text-xs font-normal text-slate-400">
                            Admin
                        </span>
                    </Link>
                </div>
                <nav className="flex flex-1 flex-col gap-1 p-3">
                    <NavLink to="/admin/orders" className={itemClass}>
                        Orders
                    </NavLink>
                    <NavLink to="/admin/categories" className={itemClass}>
                        Categories
                    </NavLink>
                    <NavLink to="/admin/products" className={itemClass}>
                        Products
                    </NavLink>
                </nav>
                <div className="border-t border-slate-800 p-3">
                    <Link
                        to="/"
                        className="text-sm text-slate-400 transition hover:text-white"
                    >
                        ← Back to storefront
                    </Link>
                </div>
            </aside>
            <div className="flex min-w-0 flex-1 flex-col">
                <main className="flex-1 overflow-auto p-6 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
