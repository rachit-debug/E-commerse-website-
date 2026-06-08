import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { CartContext } from './cartContext';

const STORAGE_KEY = 'shop_cart_v1';

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addToCart = useCallback((product, quantity = 1) => {
        setItems((prev) => {
            const id = product._id;
            const stock = Number(product.stockQuantity ?? 0);
            if (stock < 1) return prev;

            const addQty = Math.max(1, Number(quantity) || 1);
            const idx = prev.findIndex((x) => x.productId === id);

            if (idx === -1) {
                const q = Math.min(addQty, stock);
                return [
                    ...prev,
                    {
                        productId: id,
                        title: product.title,
                        imageUrl: product.images?.[0] || '',
                        unitPrice: Number(product.sellingPrice),
                        quantity: q,
                        stockQuantity: stock,
                    },
                ];
            }

            const line = prev[idx];
            const newQty = Math.min(line.quantity + addQty, stock);
            const next = [...prev];
            next[idx] = {
                ...line,
                quantity: newQty,
                unitPrice: Number(product.sellingPrice),
                stockQuantity: stock,
                title: product.title,
                imageUrl: product.images?.[0] || line.imageUrl,
            };
            return next;
        });
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        setItems((prev) =>
            prev
                .map((line) => {
                    if (line.productId !== productId) return line;
                    const cap = line.stockQuantity;
                    const q = Math.min(
                        Math.max(1, Number(quantity) || 1),
                        cap
                    );
                    return { ...line, quantity: q };
                })
                .filter((line) => line.quantity >= 1)
        );
    }, []);

    const removeItem = useCallback((productId) => {
        setItems((prev) => prev.filter((l) => l.productId !== productId));
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const itemCount = useMemo(
        () => items.reduce((n, l) => n + l.quantity, 0),
        [items]
    );

    const subtotal = useMemo(
        () =>
            items.reduce((n, l) => n + l.unitPrice * l.quantity, 0),
        [items]
    );

    const value = useMemo(
        () => ({
            items,
            addToCart,
            updateQuantity,
            removeItem,
            clearCart,
            itemCount,
            subtotal,
        }),
        [
            items,
            addToCart,
            updateQuantity,
            removeItem,
            clearCart,
            itemCount,
            subtotal,
        ]
    );

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}
