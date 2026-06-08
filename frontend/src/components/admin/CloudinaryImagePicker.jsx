import { useRef, useState } from 'react';
import { uploadImageToCloudinary } from '../../api/upload';
import { primaryButtonClass } from '../common/theme';

/**
 * Pick a local image, upload to Cloudinary, return URL via onUploaded.
 */
export function CloudinaryImagePicker({
    onUploaded,
    disabled,
    label = 'Upload image (Cloudinary)',
}) {
    const inputRef = useRef(null);
    const [busy, setBusy] = useState(false);
    const [localError, setLocalError] = useState(null);

    const handleChange = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        setBusy(true);
        setLocalError(null);
        try {
            const { url } = await uploadImageToCloudinary(file);
            if (url) onUploaded(url);
        } catch (err) {
            setLocalError(err.message || 'Upload failed');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="sr-only"
                onChange={handleChange}
                disabled={disabled || busy}
                aria-label="Choose image file to upload"
            />
            <button
                type="button"
                disabled={disabled || busy}
                onClick={() => inputRef.current?.click()}
                className={`${primaryButtonClass} w-auto max-w-xs bg-slate-700 px-4 py-2 text-sm shadow-slate-700/20 hover:bg-slate-600`}
            >
                {busy ? 'Uploading…' : label}
            </button>
            {localError ? (
                <p className="text-sm text-red-600">{localError}</p>
            ) : null}
        </div>
    );
}
