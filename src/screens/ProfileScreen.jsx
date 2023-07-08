import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Linking } from 'react-native';
import { Auth } from 'aws-amplify';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { DataStore } from 'aws-amplify';
import { User } from '../models';
import MapView, { Marker } from 'react-native-maps';


function ProfileScreen() {
  const { dbUser } = useAuthContext();
  const [name, setName] = useState(dbUser?.name || '');
  const [address, setAddress] = useState(dbUser?.address || '');
  const [lat, setLat] = useState(dbUser?.lat.toString() || '0');
  const [lng, setLng] = useState(dbUser?.lng.toString() || '0');
  const [phoneNumber, setPhoneNumber] = useState(dbUser?.phoneNumber || '');
  const [email, setEmail] = useState(dbUser?.email || '');

  const { sub, setDbUser } = useAuthContext();
  const navigation = useNavigation();

  const onSave = async () => {
    if (dbUser?.id) {
      await updateUser();
    } else {
      await createUser();
      navigation.goBack();
    }
  };

  const updateUser = async () => {
    try {
      const user = await DataStore.save(
        User.copyOf(dbUser, (updated) => {
          updated.name = name;
          updated.address = address;
          updated.lat = parseFloat(lat);
          updated.lng = parseFloat(lng);
          updated.phoneNumber = phoneNumber.toString();
          updated.email = email;
        })
      );
      setDbUser(user);
      Alert.alert('User Updated Successfully');
    } catch (error) {
      console.log('Error updating user:', error);
    }
  };

  const createUser = async () => {
    try {
      const user = await DataStore.save(
        new User({
          name,
          address,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          phoneNumber: phoneNumber.toString(),
          email,
          sub,
        })
      );
      setDbUser(user);
      Alert.alert('User Created Successfully');
    } catch (e) {
      console.log('Error', e.message);
    }
  };



  return (
    <View style={styles.container}>
      <Header title="FoodX" />
      <View style={styles.profileHeader}>
        <Icon name="person-circle-outline" size={30} color="#1C64F2" style={styles.profileIcon} />
        <Text style={styles.header}>Profile</Text>
      </View>

      <View style={styles.profileInfo}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholderTextColor="#888"
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#888"
          keyboardType="email-address"
        />



        <TextInput
          style={styles.input}
          placeholder="Latitude"
          value={lat}
          onChangeText={setLat}
          placeholderTextColor="#888"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          value={lng}
          onChangeText={setLng}
          placeholderTextColor="#888"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity onPress={onSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Auth.signOut()} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileIcon: {
    marginRight: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  locationButton: {
    backgroundColor: '#1C64F2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  locationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#1C64F2',
    paddingVertical: 5,
    margin: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '50%',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signOutButton: {
    backgroundColor: '#1C64F2',
    paddingVertical: 5,
    margin: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '50%',
  },
  signOutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileScreen;
