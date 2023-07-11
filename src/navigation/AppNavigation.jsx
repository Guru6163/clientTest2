import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthContext } from '../contexts/AuthContext';
import { useOrderContext } from '../contexts/OrderContext';
import HomeScreen from '../screens/HomeScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OrdersScreen from '../screens/OrdersScreen';
import BasketScreen from '../screens/BasketScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import DeliveryAddressScreen from '../screens/DeliveryAddressScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  const { dbUser } = useAuthContext();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {dbUser ? (
        <>
          <Stack.Screen name="HomeTabs" component={HomeBottomTabsScreen} />
          <Stack.Screen name="SignInStack" component={SignInStackNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name="SignInStack" component={SignInStackNavigator} />
          <Stack.Screen name="HomeTabs" component={HomeBottomTabsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const HomeBottomTabsScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabelStyle: { fontWeight: 'bold' },
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'FoodX') {
            iconName = 'fast-food-outline';
          } else if (route.name === 'Cart') {
            iconName = 'cart-outline';
          } else if (route.name === 'Orders') {
            iconName = 'receipt-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="FoodX" component={HomeStackNavigator} />
      <Tab.Screen name="Cart" component={BasketScreen} />
      <Tab.Screen name="Orders" component={OrderStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const HomeStack = createNativeStackNavigator();
const SignInStack = createNativeStackNavigator();

const SignInStackNavigator = () => {
  return (
    <SignInStack.Navigator screenOptions={{ headerShown: false }}>
      <SignInStack.Screen name="SignIn" component={SignInScreen} />
      <SignInStack.Screen name="SignUp" component={SignUpScreen} />
      <SignInStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <SignInStack.Screen name="NewPassword" component={NewPasswordScreen} />
    </SignInStack.Navigator>
  );
};

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Restaurants" component={HomeScreen} />
      <HomeStack.Screen name="Restaurant" component={RestaurantDetailScreen} />
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
