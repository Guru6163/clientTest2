import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { Order } from '../models';
import { DataStore } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  const sortByCreatedAt = (data) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA; // Sort in descending order (newest to oldest)
    });
  };

  const fetchData = useCallback(async () => {
    try {
      const orders = await DataStore.query(Order);
      const sortedOrders = sortByCreatedAt(orders);
      setOrders(sortedOrders);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Order', { orderItem: item })}
      style={styles.orderCard}
    >
      <Text style={styles.orderNumber}>Order ID: {item?.id}</Text>
      <Text style={styles.totalPrice}>Total Price: ₹{item.total}</Text>
      <Text style={styles.date}>Date: {new Date(item.createdAt).toLocaleString()}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [fetchData]);

  return (
    <View style={styles.container}>
      <Header title="FoodX" />
      <FlatList
        data={orders}
        keyExtractor={(item) => item?.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2, // Add elevation for a subtle shadow effect
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  totalPrice: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: '#1C64F2', // Customize the color for the status
  },
});

export default OrdersScreen;
