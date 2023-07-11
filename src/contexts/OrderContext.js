import { createContext, useContext, useState, useEffect } from "react";
import { DataStore } from "aws-amplify";
import { Alert } from "react-native";
import { Order, OrderDish, Dish } from "../models";
import { useAuthContext } from "./AuthContext";
import { useBasketContext } from "./BasketContext";
import { useNavigation } from "@react-navigation/native";


const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
  const { dbUser } = useAuthContext();
  const navigation = useNavigation()
  const { restaurant, totalPrice, cartItems, setCartItems } = useBasketContext();
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    DataStore.query(Order, (o) => o.userID.eq(dbUser.id)).then(setOrders);
  }, [dbUser]);

  const createOrder = async (rpOrderId, rpPaymentId, paymentMethod) => {
    console.log(rpOrderId, rpPaymentId)
    try {
      const newOrder = await DataStore.save(
        new Order({
          userID: dbUser.id,
          Restaurant: restaurant,
          status: "NEW",
          total: parseInt(totalPrice),
          paymentMethod: paymentMethod,
          razorpayPaymentId: rpPaymentId || "-",
          razorpayOrderId: rpOrderId || "-"
        })
      );

      await Promise.all(
        cartItems.map(async (basketDish) => {
          const { quantity, id } = basketDish;
          const fetchedDish = await DataStore.query(Dish, id);

          if (fetchedDish) {
            const dishInstance = fetchedDish;
            await DataStore.save(
              new OrderDish({
                quantity: quantity,
                orderID: newOrder.id,
                Dish: dishInstance,
              })
            );
          }
        })
      );

      setOrders([newOrder, ...orders]);
      setCartItems([])
      navigation.navigate("Restaurants")
    } catch (error) {
      Alert.alert("Error creating order:", error);

    }
  };


  const getOrder = async (id) => {
    const order = await DataStore.query(Order, id);
    const orderDishes = await DataStore.query(OrderDish, (od) =>
      od.orderID.eq(id)
    );

    return { ...order, dishes: orderDishes };
  };

  return (
    <OrderContext.Provider value={{ createOrder, orders, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);