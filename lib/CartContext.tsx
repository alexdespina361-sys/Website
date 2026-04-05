"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { CART_STORAGE_KEY, LEGACY_CART_STORAGE_KEY } from "@/lib/site";

export interface CartItem {
  id: string;
  variantId: string;
  name: string;
  slug: string;
  size: string | null;
  color: string | null;
  priceCents: number;
  quantity: number;
  image: string;
  availableStock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalCents: number;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const saved =
      localStorage.getItem(CART_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_CART_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (item): item is CartItem =>
                Boolean(
                  item &&
                    typeof item.id === "string" &&
                    typeof item.variantId === "string" &&
                    typeof item.name === "string" &&
                    typeof item.priceCents === "number"
                )
            )
          );
        }
      } catch {
        // Invalid JSON, start fresh
      }
    }
    setLoaded(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
    }
  }, [items, loaded]);

  const addItem = (item: Omit<CartItem, "id" | "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);

      if (existing) {
        const nextQuantity = Math.min(
          existing.quantity + quantity,
          item.availableStock
        );

        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: nextQuantity } : i
        );
      }

      return [
        ...prev,
        {
          ...item,
          id: `${item.variantId}-${Date.now()}`,
          quantity: Math.min(quantity, item.availableStock),
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.min(quantity, i.availableStock) } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("red-studio-cart");
  };

  const totalCents = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCents,
        itemCount,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
