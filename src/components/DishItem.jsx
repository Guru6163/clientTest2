import { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useBasketContext } from "../contexts/BasketContext";


const DishItem = ({ dishItem }) => {
    const {
        cartItems,
        addToCart,
        removeFromCart,
    } = useBasketContext();

    const [quantity, setQuantity] = useState(1);
    const [showControls, setShowControls] = useState(false);

    const onAddToCart = () => {
        addToCart(dishItem);
        setShowControls(true);
    };

    const onMinus = () => {
        removeFromCart(dishItem);
    };

    const onPlus = () => {
        addToCart(dishItem);
    };


    useEffect(() => {
        const cartItem = cartItems.find((item) => item.id === dishItem.id);
        if (cartItem) {
            setQuantity(cartItem.quantity);
            setShowControls(true);
        } else {
            setQuantity(1);
            setShowControls(false);
        }
    }, [cartItems, dishItem]);

    return (
        <View style={styles.dishContainer}>
            <Image source={{ uri: dishItem.image }} style={styles.dishImage} />
            <View style={styles.dishDetails}>
                <View style={styles.itemDetailsContainer}>
                    <Text style={styles.dishName}>{dishItem.name}</Text>
                    <Text style={styles.dishPrice}>Rs{dishItem.price}</Text>
                </View>

                {showControls ? (
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={onMinus}
                        >
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={onPlus}
                        >
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Pressable onPress={onAddToCart} style={styles.addButton}>
                        <Text style={styles.addButtonText}>
                            Add to Cart
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    dishContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 12,
    },
    dishImage: {
        width: 80,
        height: 100,
        borderRadius: 8,
    },
    dishDetails: {
        flex: 1,
        marginLeft: 12,
    },

    dishDescription: {
        fontSize: 14,
        color: 'gray',
    },


    addToCartButton: {
        backgroundColor: '#1C64F2',
        paddingVertical: 8,
        borderRadius: 8,

        alignItems: 'center',
    },
    addToCartButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    itemDetailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    dishName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    dishPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1C64F2',
    },


    addButton: {
        backgroundColor: '#1C64F2',
        paddingVertical: 14,
        borderRadius: 5,
        marginTop: 12,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    quantityButton: {
        backgroundColor: '#1C64F2',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5,
        flex: 1,
        marginRight: 4,
    },
    quantityButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },



});

export default DishItem;
