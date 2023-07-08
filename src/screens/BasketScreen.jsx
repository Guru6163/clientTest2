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
        <Text style={styles.sectionTitle}>Cart Items</Text>
        {cartItems.length > 0 && (
          <View>
            <Text style={styles.restaurantName}>Restaurant</Text>
            <Text style={styles.restaurantName}>{restaurant?.name}</Text>
          </View>
        )}
        <FlatList
          data={cartItems}
          renderItem={({ item }) => <BasketDishItem basketDish={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      {cartItems.length > 0 && (
        <View style={styles.totalContainer}>
          <Pressable onPress={onCreateOrder} style={styles.button} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {`Create Order • Rs ${totalPrice.toFixed(2)}`}
              </Text>
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
  restaurantName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  },
  button: {
    backgroundColor: '#1C64F2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BasketScreen;
