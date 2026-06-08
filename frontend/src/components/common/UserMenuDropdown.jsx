import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, parseJwtPayload } from '../../utils/auth';

function UserIcon({ className }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
        </svg>
    );
}

const menuLinkClass =
    'block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50';

const menuDividerClass = 'my-1 border-t border-slate-100';

export function UserMenuDropdown({ align = 'right' }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return undefined;
        const close = (e) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [open]);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setOpen(false);
        navigate('/');
    };

    const payload = parseJwtPayload(getToken());
    const isAdmin = payload?.role === 'admin';

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="Account menu"
            >
                <UserIcon className="size-6" />
            </button>

            {open ? (
                <div
                    className={`absolute z-50 mt-2 min-w-[13.5rem] rounded-xl border border-slate-200/80 bg-white py-1 shadow-lg shadow-slate-200/50 ${
                        align === 'right' ? 'right-0' : 'left-0'
                    }`}
                    role="menu"
                >
                    <Link
                        to="/account/orders"
                        role="menuitem"
                        className={menuLinkClass}
                        onClick={() => setOpen(false)}
                    >
                        My orders
                    </Link>
                    <Link
                        to="/account/profile"
                        role="menuitem"
                        className={menuLinkClass}
                        onClick={() => setOpen(false)}
                    >
                        Profile & settings
                    </Link>
                    {isAdmin ? (
                        <Link
                            to="/admin/orders"
                            role="menuitem"
                            className={menuLinkClass}
                            onClick={() => setOpen(false)}
                        >
                            Admin dashboard
                        </Link>
                    ) : null}
                    <div className={menuDividerClass} />
                    <button
                        type="button"
                        role="menuitem"
                        className={`${menuLinkClass} w-full text-left font-medium text-red-600 hover:bg-red-50 hover:text-red-700`}
                        onClick={logout}
                    >
                        Sign out
                    </button>
                </div>
            ) : null}
        </div>
    );
}
