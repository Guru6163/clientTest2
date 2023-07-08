import { createContext, useState, useContext, useEffect } from "react";

import { useAuthContext } from "./AuthContext";

const BasketContext = createContext({});

const BasketContextProvider = ({ children }) => {
    const { dbUser } = useAuthContext();
    const [restaurant, setRestaurant] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        // Calculate total price when cart items change
        calculateTotalPrice();
    }, [cartItems]);

    const calculateTotalPrice = () => {
        let total = 0;
        cartItems.forEach((item) => {
            total += item.price * item.quantity;
        });
        total += restaurant?.deliveryFee
        setTotalPrice(total);
    };

    const addToCart = (item) => {
        const updatedCartItems = [...cartItems];
        const existingItemIndex = updatedCartItems.findIndex((cartItem) => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
            // If the item already exists in the cart, update its quantity
            updatedCartItems[existingItemIndex].quantity++;
        } else {
            // If the item is not in the cart, add it with a quantity of 1
            updatedCartItems.push({ ...item, quantity: 1 });
        }

        setCartItems(updatedCartItems);
    };

    const removeFromCart = (item) => {
        const updatedCartItems = [...cartItems];
        const existingItemIndex = updatedCartItems.findIndex((cartItem) => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
            // If the item already exists in the cart, decrease its quantity
            if (updatedCartItems[existingItemIndex].quantity > 1) {
                updatedCartItems[existingItemIndex].quantity--;
            } else {
                // If the quantity is 1 and the "subtract" button is pressed again, remove the item from the cart
                updatedCartItems.splice(existingItemIndex, 1);
            }
        }

        setCartItems(updatedCartItems);
    };

    const deleteFromCart = (item) => {
        const updatedCartItems = cartItems.filter((cartItem) => cartItem.id !== item.id);
        setCartItems(updatedCartItems);
    }

    return (
        <BasketContext.Provider
            value={{
                setRestaurant,
                restaurant,
                cartItems,
                addToCart,
                removeFromCart,
                totalPrice,
                deleteFromCart,
                setCartItems
            }}
        >
            {children}
        </BasketContext.Provider>
    );
};

export default BasketContextProvider;

export const useBasketContext = () => useContext(BasketContext);
