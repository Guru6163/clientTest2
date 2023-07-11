import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { useBasketContext } from '../contexts/BasketContext';
import BasketDishItem from '../components/BasketDishItem';
import { useOrderContext } from '../contexts/OrderContext';

const BasketScreen = () => {
  const navigation = useNavigation();
  const { restaurant, cartItems, totalPrice } = useBasketContext();
  const { createOrder } = useOrderContext();
  const [isLoading, setIsLoading] = useState(false);

  const onCreateOrder = async () => {
    setIsLoading(true);
    try {
      // await createOrder();
      setIsLoading(false);
      navigation.navigate('Delivery');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Order Failed', 'Failed to create the order. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="FoodX" />
      <View style={styles.orderContainer}>
        <View style={styles.restaurantContainer}>
          <Text style={styles.restaurantTitle}>Restaurant</Text>
          <Text style={styles.restaurantName}>{restaurant?.name}</Text>
        </View>
        <Text style={styles.sectionTitle}>Cart Items</Text>
        <FlatList
          data={cartItems}
          renderItem={({ item }) => <BasketDishItem basketDish={item} />}
          keyExtractor={(item) => item?.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      {cartItems.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalPrice}>Total: ₹{totalPrice.toFixed(2)}</Text>
          <Pressable onPress={onCreateOrder} style={styles.button} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Create Order</Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  orderContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  restaurantContainer: {
    marginBottom: 20,
  },
  restaurantTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#777',
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 16,
  },
  totalContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#1C64F2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BasketScreen;
