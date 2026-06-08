import { Outlet } from 'react-router-dom';
import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';
import { pageShellClass } from './theme';

export function AccountLayout() {
    return (
        <div className={pageShellClass}>
            <AppHeader variant="home" />
            <div className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
                    <Outlet />
                </div>
            </div>
            <AppFooter />
        </div>
    );
}
