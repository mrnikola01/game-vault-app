import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import api from "../api/client";

const CartContext = createContext({});

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = useCallback(
    async (showLoading = true) => {
      if (user) {
        if (showLoading) setIsLoading(true);
        try {
          const data = await api("/cart/");
          setCart(data || []);
        } catch (err) {
          console.error("Failed to fetch cart:", err);
          setCart([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setCart([]);
        setIsLoading(false);
      }
    },
    [user],
  );

  const addToCart = async (gameId) => {
    if (!user) return;
    try {
      await api("/cart/", {
        body: { game: gameId, quantity: 1 },
      });
      await refreshCart(false);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!user) return;
    try {
      await api(`/cart/${cartItemId}/`, {
        method: 'DELETE'
      });
      await refreshCart(false);
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  const updateQuantity = async (cartItemId, newQty) => {
    if (!user) return;
    if (newQty < 1) return removeFromCart(cartItemId);
    try {
      await api(`/cart/${cartItemId}/`, {
        method: 'PATCH',
        body: { quantity: newQty },
      });
      await refreshCart(false);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const subtotal = cart.reduce(
    (acc, item) => acc + (parseFloat(item.game_details?.price) || 0) * item.quantity,
    0,
  );

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        isLoading,
        refreshCart,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
