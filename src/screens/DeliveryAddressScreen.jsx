import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../components/Header';
import MapView, { Marker } from 'react-native-maps';
import { useAuthContext } from '../contexts/AuthContext';
import Geolocation from '@react-native-community/geolocation';
import RazorpayCheckout from 'react-native-razorpay';
import { User } from '../models';
import { DataStore } from 'aws-amplify';
import { useOrderContext } from '../contexts/OrderContext';
import { useBasketContext } from '../contexts/BasketContext';
import { encode as base64Encode } from 'base-64';

function DeliveryAddressScreen() {
    const { dbUser, setDbUser } = useAuthContext();
    const { totalPrice } = useBasketContext()
    const { createOrder } = useOrderContext()
    const [name, setName] = useState(dbUser?.name || '');
    const [address, setAddress] = useState(dbUser?.address || '');
    const [phoneNumber, setPhoneNumber] = useState(dbUser?.phoneNumber || '');
    const [lat, setLat] = useState(dbUser?.lat.toString() || '0');
    const [lng, setLng] = useState(dbUser?.lng.toString() || '0');
    const [rpOrder, setRpOrder] = useState({})
    const [paymentMethod, setPaymentMethod] = useState("Online Payment")

    const createRPOrder = async () => {
        const username = 'rzp_test_s96WrESoIIuwmE';
        const password = 'xwXAAgCLUlLF18LE0LD9AyDR';
        const headers = new Headers();
        const credentials = `${username}:${password}`;
        const encodedCredentials = base64Encode(credentials);
        headers.append('Authorization', `Basic ${encodedCredentials}`);

        var options = {
            'method': 'POST',
            'url': 'https://api.razorpay.com/v1/orders',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${encodedCredentials}`
            },
            body: JSON.stringify({
                "amount": totalPrice*100,
                "currency": "INR",
            })

        };

        try {
            const response = await fetch('https://api.razorpay.com/v1/orders', options);
            const data = await response.json();
            Alert.alert(JSON.stringify(data))
            setRpOrder(data);
        } catch (error) {
            console.error(error);
        }
    };

    const [region, setRegion] = useState({
        latitude: 12.669160,
        longitude: 79.287086,
        latitudeDelta: 0.0321,
        longitudeDelta: 0.0021,
    });

    const getCurrentLocation = async () => {
        try {
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    console.log(latitude, longitude)
                    setLat(latitude.toString());
                    setLng(longitude.toString());
                    setRegion({
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.0321,
                        longitudeDelta: 0.0021,
                    })

                },
                error => {
                    console.log('Error getting current location:', error);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        } catch (error) {
            console.log('Error getting current location:', error);
        }
    };


    useEffect(() => {
        getCurrentLocation();
    }, []);

    const handleMapPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setLat(latitude.toString());
        setLng(longitude.toString());
    };

    const handleProceed = async () => {
        try {
            const user = await DataStore.save(
                User.copyOf(dbUser, (updated) => {
                    updated.name = name;
                    updated.address = address;
                    updated.lat = parseFloat(lat);
                    updated.lng = parseFloat(lng);
                    updated.phoneNumber = phoneNumber.toString();
                })
            );
            setDbUser(user);
            console.log('User Updated Successfully', JSON.stringify(user));
        } catch (error) {
            console.log('Error updating user:', error);
        }
        if (paymentMethod === "Online Payment") {
            createRPOrder()
            var options = {
                description: 'Credits towards consultation',
                image: 'https://i.imgur.com/3g7nmJC.jpg',
                currency: 'INR',
                key: 'rzp_test_s96WrESoIIuwmE',
                amount: totalPrice * 100,
                name: 'Food Stack',
                order_id: rpOrder.id,
                prefill: {
                    email: dbUser.email,
                    contact: dbUser.phoneNumber,
                    name: dbUser.name
                },
                theme: { color: '#53a20e' }
            }
            RazorpayCheckout.open(options).then((data) => {
                createOrder(rpOrder.id, data.razorpay_payment_id, paymentMethod)
            }).catch((error) => {
                Alert.alert(`Error: Payment Failed`);
            });
        } else {
            try {
                await createOrder("", "", paymentMethod)
            }
            catch (err) {
                console.log(err)
            }
        }
    };


    return (
        <ScrollView style={styles.container}>
            <Header title="FoodX" />
            <Text style={styles.deliveryTitle}>Delivery Details</Text>
            <View style={styles.mapContainer}>
                <Text style={styles.instructionsText}>Drag and drop the pin to accurately mark your current location</Text>
                <TouchableOpacity onPress={getCurrentLocation} style={{ width: "100%", padding: 10, backgroundColor: "#4B5563" }}>
                    <Text style={styles.proceedButtonText}>Locate Me</Text>
                </TouchableOpacity>
                <MapView
                    style={styles.map}
                    region={region}
                    onRegionChangeComplete={setRegion}
                    onPress={handleMapPress}
                >
                    <Marker draggable coordinate={{ latitude: parseFloat(lat), longitude: parseFloat(lng) }} />

                </MapView>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />
            </View>


            <View style={styles.paymentContainer}>

                <Text style={styles.paymentLabel}>Select Payment Method:</Text>

                <Picker
                    style={styles.paymentInput}
                    selectedValue={paymentMethod}
                    onValueChange={(value) => {
                        setPaymentMethod(value)
                    }}
                >
                    <Picker.Item label="Online Payment" value="Online Payment" />
                    <Picker.Item label="Cash On Delivery" value="Cash On Delivery" />
                </Picker>

            </View>
            <Text style={{paddingHorizontal:20,marginTop:10}}>
                Order Total : {totalPrice}
            </Text>

            <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
                <Text style={styles.proceedButtonText}>Proceed</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    deliveryTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    inputContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    mapContainer: {
        height: 320,
        overflow: 'hidden',
        marginHorizontal: 20,

    },
    map: {
        flex: 1,
    },
    instructionsText: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 10,
        backgroundColor: "#6B7280",
        color: "white",
        padding: 10,
        borderRadius: 5,
    },
    paymentContainer: {
        paddingHorizontal: 20,

    },
    paymentLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    paymentInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 0,
        backgroundColor: "#F3F4F6",
        marginBottom: 10
    },
    proceedButton: {
        backgroundColor: '#1C64F2',
        paddingVertical: 10,
        margin: 20,
        borderRadius: 5,
    },
    proceedButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default DeliveryAddressScreen;
