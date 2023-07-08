import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const CTASection = () => {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>
                Hungry? We've got you covered!
                </Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Express Reach</Text>
                </TouchableOpacity>
            </View>

            <Image
                source={{
                    uri:
                        'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
                }}
                style={styles.image}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: '#F3F4F6', // bg-gray-50
        flexDirection: 'row',
        borderRadius: 15,
        marginHorizontal: 15,
    },
    textContainer: {
        padding: 16, // p-8 for small screens, p-12 for medium screens, px-16 py-24 for large screens
        flex: 1,
    },
    title: {
        fontSize: 20, // text-2xl
        fontWeight: 'bold',
        color: '#1F2937', // text-gray-900
        marginBottom: 8, // mt-4 for medium screens, block for medium screens
    },
    description: {
        fontSize: 16, // hidden
        color: '#4B5563', // text-gray-500
        marginBottom: 16, // mt-4 for medium screens, block for medium screens
    },
    button: {
        backgroundColor: '#1C64F2', // bg-emerald-600
        borderRadius: 8,
        paddingVertical: 6, // py-3
        paddingHorizontal: 24, // px-12
    },
    buttonText: {
        fontSize: 14, // text-sm
        fontWeight: 'bold',
        color: '#FFFFFF', // text-white
        textAlign: 'center',
    },
    image: {
        flex: 1,
        height: "100%", // h-56 for small screens, h-full for medium screens
        resizeMode: 'cover',
    },
});

export default CTASection;
