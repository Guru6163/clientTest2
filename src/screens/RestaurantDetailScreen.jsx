import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import Header from '../components/Header';
import { DataStore } from 'aws-amplify';
import { Restaurant, Dish } from '../models';
import { useBasketContext } from '../contexts/BasketContext';
import { useNavigation } from '@react-navigation/native';
import DishItem from '../components/DishItem';
import Icon from 'react-native-vector-icons/Ionicons';


const RestaurantDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const id = route.params?.id;
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  
  const {
    setRestaurant: setBasketRestaurant,
    cartItems,
    addToCart,
    removeFromCart,
  } = useBasketContext();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        return;
      }
      setBasketRestaurant(null);
      try {
        const restaurantData = await DataStore.query(Restaurant, id);
        setRestaurant(restaurantData);
        const dishData = await DataStore.query(Dish, (dish) => dish.restaurantID.eq(id));
        setDishes(dishData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);


  useEffect(() => {
    setBasketRestaurant(restaurant);
  }, [restaurant]);


  if (!restaurant) {
    return <ActivityIndicator size={"large"} color="gray" />;
  }

  const renderDishItem = ({ item }) => {
    return (
      <DishItem
        dishItem={item}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />
    );
  };

  const getCategoryName = (category) => {
    const categoryWithoutHyphen = category.replace(/-/g, " "); // Replace hyphen "-" with a space " "

    switch (categoryWithoutHyphen) {
      case "VEG":
        return "Veg";
      case "NON_VEG":
        return "Non-Veg";
      case "BOTH":
        return "Veg and Non-Veg";
      case "JUICES":
        return "Juices";
      default:
        return capitalizeFirstLetter(categoryWithoutHyphen);
    }
  };


  const renderRatingStars = () => {
    const rating = restaurant.rating;
    if (typeof rating !== 'number' || rating < 0) {
      return null; // Return null or a fallback if rating is not a valid number
    }

    const filledStars = Math.floor(rating);
    const halfStar = rating - filledStars >= 0.5;
    const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
      }}>
        {Array.from({ length: filledStars }).map((_, index) => (
         <Icon name="star" size={16} color="#FFD700" />
        ))}
        {halfStar && <Icon name="star-half" size={16} color="#FFD700" />}
        {Array.from({ length: emptyStars }).map((_, index) => (
         <Icon name="star-outline" size={16} color="#FFD700" />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="FoodX" />
      {restaurant && (
        <View style={styles.restaurantContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
          <View style={styles.restaurantDetails}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantCategory}>{getCategoryName(restaurant?.category)}</Text>
            {renderRatingStars()}
            <Text style={styles.deliveryTime}>
              Delivery Time: {restaurant.minDeliveryTime}-{restaurant.maxDeliveryTime} mins
            </Text>
          </View>
        </View>
      )}

      <FlatList
        data={dishes}
        keyExtractor={(item) => item?.id}
        renderItem={renderDishItem}
        style={styles.dishList}
      />
      {cartItems && (
        <Pressable
          onPress={() => navigation.navigate("Cart")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Open basket ({cartItems.length})
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  restaurantImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 0,
    textAlign: 'center',
    color:"black"
  },
  highlightedRestaurantName: {
    backgroundColor: '#1C64F2',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 5,

  },

  dishList: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1C64F2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginBottom: 16,
    alignSelf: 'center', // Center the button horizontally
    width: "90%",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  restaurantContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16, // Add margin bottom to create space between sections
  },
  restaurantImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantCategory: {
    fontSize: 16,
    color: 'gray',
    marginTop: 4,
  },
  deliveryTime: {
    fontSize: 14,
    color: 'gray',
    marginTop: 8,
  },

});

export default RestaurantDetailScreen;
