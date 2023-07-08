import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useBasketContext } from '../contexts/BasketContext';

const Header = ({ title }) => {
  const { cartItems } = useBasketContext();

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Icon name="fast-food-outline" size={24} color="black" />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightContent}>
        <Icon name="cart-outline" size={24} color="black" />
        {cartItems.length > 0 && (
          <View style={styles.cartItemCount}>
            <Text style={styles.cartItemCountText}>{cartItems.length}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-end',
    position: 'relative', // Enable positioning for the cart item count
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cartItemCount: {
    position: 'absolute',
    top: -5, // Adjust the position as needed
    right: -5, // Adjust the position as needed
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItemCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;
