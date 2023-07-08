import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native'; // Import SafeAreaView
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react-native";
import config from "./src/aws-exports";
import AppNavigation from './src/navigation/AppNavigation';
import { NavigationContainer } from "@react-navigation/native";
import AuthContextProvider from './src/contexts/AuthContext';
import BasketContextProvider from './src/contexts/BasketContext';
import OrderContextProvider from './src/contexts/OrderContext';


Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

function Main() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <NavigationContainer>
        <AuthContextProvider>
          <BasketContextProvider>
            <OrderContextProvider>
            <AppNavigation />
            </OrderContextProvider>
          </BasketContextProvider>
        </AuthContextProvider>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default withAuthenticator(Main);
