import { memo, useEffect, useState } from 'react';
import { fetchCurrentUser, updateUserProfile } from '../../api/user';
import {
    dangerTextClass,
    inputClass,
    labelClass,
    primaryButtonClass,
    spinnerClass,
} from '../../components/common/theme';

const AccountProfile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const u = await fetchCurrentUser();
                if (!cancelled && u) {
                    setUser(u);
                    setName(u.name || '');
                    setPhoneNumber(u.phoneNumber || '');
                    setAddress(u.address || '');
                }
            } catch (e) {
                if (!cancelled) setError(e.message || 'Could not load profile');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSaved(false);
        if (phoneNumber && String(phoneNumber).length !== 10) {
            setError('Phone must be exactly 10 digits or left empty.');
            setSaving(false);
            return;
        }
        try {
            const updated = await updateUserProfile({
                name,
                phoneNumber,
                address,
            });
            if (updated) {
                setUser(updated);
                setName(updated.name || '');
                setPhoneNumber(updated.phoneNumber || '');
                setAddress(updated.address || '');
            }
            setSaved(true);
        } catch (err) {
            setError(err.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Profile
            </h1>
            <p className="mt-1 text-sm text-slate-600">
                View your details and update your contact information.
            </p>

            {loading && (
                <p className="mt-8 text-slate-600">Loading profile…</p>
            )}

            {!loading && user && (
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 max-w-xl rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
                >
                    <div className="mb-6 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Email</span>
                        <p className="mt-0.5 text-slate-900">{user.email}</p>
                        <p className="mt-2 text-xs text-slate-500">
                            Email cannot be changed here.
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="profile-name" className={labelClass}>
                                Full name
                            </label>
                            <input
                                id="profile-name"
                                className={inputClass}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="profile-phone" className={labelClass}>
                                Phone (10 digits)
                            </label>
                            <input
                                id="profile-phone"
                                type="tel"
                                className={inputClass}
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Optional"
                                maxLength={10}
                            />
                        </div>
                        <div>
                            <label htmlFor="profile-address" className={labelClass}>
                                Address
                            </label>
                            <textarea
                                id="profile-address"
                                className={`${inputClass} min-h-[100px] resize-y`}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Delivery address (optional)"
                                rows={4}
                            />
                        </div>
                    </div>

                    {error ? <p className={`${dangerTextClass} mt-4`}>{error}</p> : null}
                    {saved && !error ? (
                        <p className="mt-4 text-sm font-medium text-emerald-600">
                            Profile saved.
                        </p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={saving}
                        className={`${primaryButtonClass} mt-6 w-auto px-8 disabled:opacity-60`}
                    >
                        {saving ? (
                            <span className={spinnerClass} aria-hidden />
                        ) : (
                            'Save changes'
                        )}
                    </button>
                </form>
            )}

            {!loading && !user && error ? (
                <p className="mt-8 text-red-600">{error}</p>
            ) : null}
        </div>
    );
};

export default memo(AccountProfile);
