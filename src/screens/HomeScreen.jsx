import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { DataStore } from 'aws-amplify';
import { Restaurant } from '../models';
import Header from '../components/Header';
import RestaurantCard from '../components/RestaurantCard';
import CTASection from '../components/CTA';
import Category from '../components/Category';

const HomeScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const isFocused = useIsFocused();

  const fetchRestaurants = useCallback(async () => {
    try {
      const posts = await DataStore.query(Restaurant);
      setRestaurants(posts);
    } catch (error) {
      console.log('Error fetching restaurants:', error);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  useEffect(() => {
    // Fetch restaurants data whenever the screen comes into focus
    if (isFocused) {
      fetchRestaurants();
    }
  }, [isFocused, fetchRestaurants]);

  const renderRestaurantItem = ({ item }) => {
    return <RestaurantCard data={item} />;
  };

  return (
    <View style={styles.container}>
      <Header title="FoodX" />
      <ScrollView>
        <CTASection />
        {/* <Category /> */}
        <FlatList
          style={styles.flatList}
          data={restaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  flatList: {
    flex: 1,
  },
});

export default HomeScreen;
