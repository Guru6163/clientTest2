import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Category = () => {
  const categories = ['VEG', 'NON_VEG', 'BOTH', 'JUICES'];

  const getCategoryName = (category) => {
    const categoryWithoutHyphen = category.replace(/-/g, ' '); // Replace hyphen "-" with a space " "

    switch (categoryWithoutHyphen) {
      case 'VEG':
        return 'Vegetarian';
      case 'NON_VEG':
        return 'Non-Vegetarian';
      case 'BOTH':
        return 'Both Veg and Non-Veg';
      case 'JUICES':
        return 'Juices';
      default:
        return capitalizeFirstLetter(categoryWithoutHyphen);
    }
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {categories.map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <Text style={styles.categoryText}>{getCategoryName(category)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical:10,
  },
  categoryItem: {
    backgroundColor: '#1C64F2',
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
});

export default Category;
