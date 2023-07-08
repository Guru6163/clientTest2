import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BasketDish } from '../../models';
import { DataStore } from 'aws-amplify';
import { useBasketContext } from '../../contexts/BasketContext';


const BasketDishItem = ({ basketDish }) => {

  const { deleteFromCart } = useBasketContext()

  const handleRemove = async () => {
    deleteFromCart(basketDish)
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemDetailsContainer}>
        <Text style={styles.itemNameText}>{basketDish.name}</Text>
        <Text style={styles.quantityText}>Quantity: {basketDish.quantity}</Text>
      </View>
      <Text style={styles.itemPriceText}>Rs {basketDish.price}</Text>
      <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
        <Icon name="close-circle" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  itemDetailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemNameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  quantityText: {
    fontSize: 13,
    color: 'gray',
  },
  itemPriceText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'gray',
  },
  removeButton: {
    marginLeft: 10,
  },
});

export default BasketDishItem;
