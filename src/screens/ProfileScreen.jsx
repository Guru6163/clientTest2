import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Linking } from 'react-native';
import { Auth } from 'aws-amplify';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { DataStore } from 'aws-amplify';
import { User } from '../models';

function ProfileScreen() {
  const { dbUser } = useAuthContext();
  const [name, setName] = useState(dbUser?.name || '');
  const [address, setAddress] = useState(dbUser?.address || '');
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
      <View style={styles.profileContainer}>
        <View style={styles.profileAvatar}>
          <Icon name="person-circle-outline" size={120} color="#1C64F2" style={styles.profileIcon} />
        </View>
        <Text style={styles.profileName}>{dbUser?.name}</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Icon name="person-outline" size={24} color="#1C64F2" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="location-outline" size={24} color="#1C64F2" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="call-outline" size={24} color="#1C64F2" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholderTextColor="#888"
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={24} color="#1C64F2" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#888"
            keyboardType="email-address"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        
        <TouchableOpacity onPress={() => {
          setDbUser([])
          Auth.signOut()
          navigation.navigate("SignInStack")
        }} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  profileAvatar: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 60,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileIcon: {
    fontSize: 100,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C64F2',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#1C64F2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#F05345',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
