import { Product } from '@/components/kiosk/shop/Interface';
import { createContext, useContext, useEffect, useState } from 'react';

export type ProductCart = {
  product: Product;
  idCart?: string;
  calculatedPrice: number;
  choosenSize?: string;
  choosenSugar?: string;
  choosenMug?: string;
  choosenLid?: string;
  quantity: number;
};

type CartContextType = {
  cart: ProductCart[];
  addToCart: (item: ProductCart) => void;
  removeFromCart: (productId: string) => void;
  removeLastFromCart: () => void;
  updateItemInCart: (
    idCart: string,
    newItemProperties: Partial<ProductCart>
  ) => void;
  getCartTotalQuantity: () => number;
  getCartTotalPrice: () => number;
  getCartTotalPfand: () => number;
  clearCart: () => void;
  payment: string;
  setPayment: React.Dispatch<React.SetStateAction<string>>;
};

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  removeLastFromCart: () => {},
  updateItemInCart: () => {},
  getCartTotalQuantity: () => 0,
  getCartTotalPrice: () => 0,
  getCartTotalPfand: () => 0,
  clearCart: () => {},
  payment: 'init',
  setPayment: () => {},
});

export const useCart = () => {
  return useContext(CartContext);
};

type CartProviderProps = {
  children: React.ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Initialize state from local storage or with an empty array if nothing is stored yet
  const [cart, setCart] = useState<ProductCart[]>(() =>
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('cart') || '[]')
      : []
  );

  const [payment, setPayment] = useState('init');

  // Whenever the cart changes, update local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (item: ProductCart) => {
    // Set the cart state by using a function which has the previous cart as an argument
    setCart((prevCart) => {
      // Look for an existing item in the cart that matches the item to be added
      // We exclude idCart and quantity from the comparison
      // as these values are expected to change even for the same product
      const existingItem = prevCart.find(
        (cartItem) =>
          JSON.stringify({
            // Get all properties of the cartItem, excluding idCart and quantity
            ...cartItem,
            idCart: undefined,
            quantity: undefined,
          }) ===
          JSON.stringify({
            // Compare with all properties of the item to be added, excluding idCart and quantity
            ...item,
            idCart: undefined,
            quantity: undefined,
          })
      );

      // Generate a unique idCart based on the current timestamp
      const idCart = Date.now().toString();

      // If there is an existing item in the cart that matches the item to be added
      if (existingItem) {
        // Map through the cart items
        const updatedCart = prevCart.map((cartItem) =>
          // If the current cartItem matches the existing item
          cartItem.idCart === existingItem.idCart
            ? // Create a new object that has all properties of the existing cart item
              // and increment the quantity of this item
              { ...cartItem, quantity: cartItem.quantity + 1 }
            : // If the current cartItem does not match the existing item, keep it as is
              cartItem
        );

        // Return the updated cart
        return updatedCart;
      } else {
        // If the item to be added does not exist in the cart, add it to the cart
        // Create a new object that has all properties of the item and add a unique idCart
        return [...prevCart, { ...item, idCart: idCart }];
      }
    });
  };

  const removeFromCart = (idCart: string) => {
    console.log(idCart);
    setCart((prevCart) => prevCart.filter((item) => item.idCart !== idCart));
  };

  const removeLastFromCart = () => {
    setCart((prevCart) => {
      if (prevCart.length > 0) {
        const lastItem = prevCart[prevCart.length - 1];
        if (lastItem.quantity > 1) {
          const updatedLastItem = {
            ...lastItem,
            quantity: lastItem.quantity - 1,
          };
          return [...prevCart.slice(0, -1), updatedLastItem];
        } else {
          return prevCart.slice(0, prevCart.length - 1);
        }
      }
      return prevCart;
    });
  };

  const updateItemInCart = (
    idCart: string,
    newItemProperties: Partial<ProductCart>
  ) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.idCart === idCart ? { ...item, ...newItemProperties } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotalQuantity = () => {
    let totalQuantity = 0;
    for (const item of cart) {
      totalQuantity += item.quantity;
    }
    return totalQuantity;
  };

  const getCartTotalPrice = () => {
    let totalPrice = 0;
    for (const item of cart) {
      totalPrice += item.calculatedPrice * item.quantity;
    }
    return parseFloat(totalPrice.toFixed(2));
  };

  const getCartTotalPfand = () => {
    let totalPfand = 0;
    for (const item of cart) {
      if (item.choosenMug === 'mehrwegVariable') {
        totalPfand = totalPfand + 1 * item.quantity;
        if (item.choosenLid === 'inklusiveDeckel') {
          totalPfand = totalPfand + 1 * item.quantity;
        }
      }
    }
    return parseFloat(totalPfand.toFixed(2));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateItemInCart,
        removeLastFromCart,
        getCartTotalPrice,
        getCartTotalPfand,
        getCartTotalQuantity,
        clearCart,
        payment,
        setPayment,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
