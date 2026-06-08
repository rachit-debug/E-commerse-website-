import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';
import { pageShellClass } from './theme';

export function AuthLayout({ children }) {
    return (
        <div className={pageShellClass}>
            <AppHeader variant="auth" />
            <main className="flex flex-1 flex-col justify-center px-4 py-12 sm:py-16">
                <div className="mx-auto w-full max-w-md">{children}</div>
            </main>
            <AppFooter />
        </div>
    );
}
