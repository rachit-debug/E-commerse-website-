import { Link } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import { HeaderCartLink } from './HeaderCartLink';
import { mutedLinkClass } from './theme';
import { UserMenuDropdown } from './UserMenuDropdown';

/**
 * @param {{ variant?: 'home' | 'auth' | 'category' }} props
 */
export function AppHeader({ variant = 'home' }) {
    const loggedIn = !!getToken();

    return (
        <header className="border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                <Link
                    to="/"
                    className="text-lg font-semibold tracking-tight text-slate-900"
                >
                    Shop<span className="text-indigo-600">.</span>
                </Link>
                <nav className="flex items-center gap-2 sm:gap-3">
                    {variant === 'home' &&
                        (loggedIn ? (
                            <>
                                <HeaderCartLink />
                                <UserMenuDropdown align="right" />
                            </>
                        ) : (
                            <>
                                <HeaderCartLink />
                                <Link
                                    to="/login"
                                    className="text-sm text-slate-600 transition hover:text-slate-900"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
                                >
                                    Create account
                                </Link>
                            </>
                        ))}
                    {variant === 'auth' && (
                        <>
                            <Link to="/" className={mutedLinkClass}>
                                Back to shop
                            </Link>
                            <HeaderCartLink />
                            {loggedIn ? (
                                <UserMenuDropdown align="right" />
                            ) : null}
                        </>
                    )}
                    {variant === 'category' && (
                        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                            <Link
                                to="/"
                                className="text-sm font-medium text-indigo-600 transition hover:text-indigo-500"
                            >
                                ← Back to categories
                            </Link>
                            <HeaderCartLink />
                            {loggedIn ? (
                                <UserMenuDropdown align="right" />
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-sm text-slate-600 transition hover:text-slate-900"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
                                    >
                                        Create account
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
