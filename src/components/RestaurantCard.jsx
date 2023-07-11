import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const RestaurantCard = ({ data }) => {
  const navigation = useNavigation();
  const handleCardPress = () => {
    navigation.navigate("Restaurant", { id: data?.id });
  };

  const renderRatingStars = () => {
    const rating = data.rating;
    if (typeof rating !== 'number' || rating < 0) {
      return null; // Return null or a fallback if rating is not a valid number
    }

    const filledStars = Math.floor(rating);
    const halfStar = rating - filledStars >= 0.5;
    const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);

    return (
      <View style={styles.ratingContainer}>
        {Array.from({ length: filledStars }).map((_, index) => (
          <Icon name="star-sharp" size={16} color="#FFD700" />
        ))}
        {halfStar && <Icon name="star-half" size={16} color="#FFD700" />}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <Icon name="star-outline" size={16} color="#FFD700" />
        ))}
      </View>
    );
  };

  const getCategoryName = (category="") => {
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

  return (
    <Pressable onPress={handleCardPress}>
      <View style={styles.container}>
        <Image source={{ uri: data.image }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.cuisine}>{getCategoryName(data?.category)}</Text>
          {renderRatingStars()}
          <Text style={styles.deliveryTime}>
            Delivery Time: {data.minDeliveryTime}-{data.maxDeliveryTime} mins
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color:"black"
  },
  cuisine: {
    fontSize: 16,
    color: 'gray',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  deliveryTime: {
    fontSize: 14,
    color: 'gray',
    marginTop: 8,
  },
});

export default RestaurantCard;
