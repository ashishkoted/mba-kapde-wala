import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, size, color) => {
    if (!size || !color) {
      alert("Please select size and color");
      return;
    }

    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size,
      color,
      quantity: 1,
    };

    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === cartProduct.id &&
          item.size === cartProduct.size &&
          item.color === cartProduct.color
      );

      if (existing) {
        return prev.map((item) =>
          item.id === cartProduct.id &&
          item.size === cartProduct.size &&
          item.color === cartProduct.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, cartProduct];
    });

    alert("Product added to cart");
  };

  const removeFromCart = (id, size, color) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.size === size && item.color === color)
      )
    );
  };

  const increaseQty = (id, size, color) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id, size, color) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}