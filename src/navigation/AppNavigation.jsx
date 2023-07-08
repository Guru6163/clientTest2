import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OrdersScreen from '../screens/OrdersScreen';
import BasketScreen from '../screens/BasketScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon library
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useOrderContext } from '../contexts/OrderContext';
import DeliveryAddressScreen from '../screens/DeliveryAddressScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppNavigation() {
  const { dbUser } = useAuthContext();
  return (
    <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeBottomTabsScreen} />  
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

const HomeBottomTabsScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="FoodX"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontWeight: 'bold', // Set the font weight to bold
        },
      }}
    >
      <Tab.Screen
        name="FoodX"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="fast-food-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={BasketScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="cart-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="receipt-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="person-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>

  );
};

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Restaurants" component={HomeScreen} />
      <HomeStack.Screen
        name="Restaurant"
        component={RestaurantDetailScreen}
        options={{ headerShown: false }}
      />
      {/* <HomeStack.Screen name="Dish" component={DishDetailsScreen} /> */}
      <HomeStack.Screen name="Basket" component={BasketScreen} />
      <HomeStack.Screen name="Delivery" component={DeliveryAddressScreen} />
    </HomeStack.Navigator>
  );
};

const OrdersStack = createNativeStackNavigator();

const OrderStackNavigator = () => {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name="All Orders" component={OrdersScreen} />
      <OrdersStack.Screen name="Order" component={OrderDetailScreen} />
    </OrdersStack.Navigator>
  );
};

export default AppNavigation;
