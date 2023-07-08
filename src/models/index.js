// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const RestaurantCategory = {
  "VEG": "VEG",
  "NON_VEG": "NON_VEG",
  "BOTH": "BOTH",
  "JUICES": "JUICES"
};

const OrderStatus = {
  "NEW": "NEW",
  "COOKING": "COOKING",
  "READY_FOR_PICKUP": "READY_FOR_PICKUP",
  "PICKED_UP": "PICKED_UP",
  "DELIVERED": "DELIVERED"
};

const { OrderDish, Order, User, Dish, Restaurant } = initSchema(schema);

export {
  OrderDish,
  Order,
  User,
  Dish,
  Restaurant,
  RestaurantCategory,
  OrderStatus
};