import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { DataStore } from 'aws-amplify';
import { Restaurant } from '../models';
import { OrderDish } from '../models';
import { Dish } from '../models';

const OrderDetailScreen = () => {
  const route = useRoute();
  const orderItem = route.params.orderItem;
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [dishItems, setDishItems] = useState([]);

  const getCategoryName = (category = '') => {
    const categoryWithoutHyphen = category.replace(/-/g, ' ');

    switch (categoryWithoutHyphen) {
      case 'VEG':
        return 'Veg';
      case 'NON_VEG':
        return 'Non-Veg';
      case 'BOTH':
        return 'Veg and Non-Veg';
      case 'JUICES':
        return 'Juices';
      default:
        return categoryWithoutHyphen;
    }
  };

  const fetchOrdersByOrderId = async (orderId) => {
    try {
      const orders = await DataStore.query(OrderDish, (order) => order.orderID.eq(orderId));
      setOrderDetails(orders);
      if (orders) {
        const dishItems = await Promise.all(
          orders.map(async (item) => {
            const dishDetails = await DataStore.query(Dish, (dish) => dish.id.eq(item.orderDishDishId));
            return { ...dishDetails[0], quantity: item.quantity };
          })
        );
        setDishItems(dishItems);
      } else {
        console.log('No Orders Found');
      }
    } catch (error) {
      console.error('Error retrieving orders:', error);
    }
  };

  const getRestaurantDetailsById = async (restaurantId) => {
    try {
      if (restaurantId) {
        const [restaurant] = await DataStore.query(Restaurant, (r) => r.id.eq(restaurantId));
        setRestaurantDetails(restaurant);
      }
    } catch (error) {
      console.error('Error retrieving restaurant details:', error);
    }
  };

  useEffect(() => {
    getRestaurantDetailsById(orderItem.orderRestaurantId);
  }, []);

  useEffect(() => {
    setDishItems([]);
    if (restaurantDetails) {
      fetchOrdersByOrderId(orderItem.id);
    }
  }, [restaurantDetails]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
      </View>
      <View>
        <Text style={styles.itemPrice}>Total: ₹
{(item?.price * item.quantity).toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Details</Text>
      </View>
      <View style={styles.orderInfo}>
        <Text style={styles.date}>Date: {new Date(orderItem.createdAt).toLocaleString()}</Text>
        <Text style={styles.status}>Status: {orderItem.status}</Text>
        <Text style={styles.paymentMethod}>Payment Method: {orderItem.paymentMethod}</Text>
      </View>
      <View style={styles.restaurantInfo}>
        <Image
          source={{ uri: restaurantDetails?.image }}
          style={styles.restaurantImage}
        />
        <View style={styles.restaurantDetails}>
          <Text style={styles.restaurantName}>{restaurantDetails?.name}</Text>
          <Text style={styles.restaurantAddress}>{restaurantDetails?.adress}</Text>
          <Text style={styles.restaurantCategory}>
            Category: {getCategoryName(restaurantDetails?.category)}
          </Text>
        </View>
      </View>
      <Text style={styles.itemsTitle}>Ordered Items</Text>
      <FlatList
        data={dishItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ₹
{orderItem.total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  orderInfo: {
    marginBottom: 20,
  },
  date: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    color: '#555',
  },
  paymentMethod: {
    fontSize: 16,
    color: '#555',
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantAddress: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  restaurantCategory: {
    fontSize: 16,
    color: '#555',
  },
  itemsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#555',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalContainer: {
    backgroundColor: '#1C64F2',
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    borderRadius: 5,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default OrderDetailScreen;
