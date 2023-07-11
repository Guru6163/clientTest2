import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Logo from "../assets/logo2.png"
import CustomButton from '../components/CustomButton/CustomButton';
import CustomInput from '../components/CustomInput/CustomInput';
import SocialSignInButtons from '../components/SocialSignInButtons/SocialSignInButtons';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { Auth } from 'aws-amplify';
import { DataStore } from 'aws-amplify';
import { User } from '../models';
import { useAuthContext } from '../contexts/AuthContext';


const SignInScreen = () => {
  const {setDbUser} = useAuthContext()
  const { height, width } = useWindowDimensions();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [bottomPadding, setBottomPadding] = useState(0);
  const [sub, setSub] = useState(null)

  useEffect(() => {
    const paddingBottom = height * 0.05; // Adjust this value as needed
    setBottomPadding(paddingBottom);
  }, [height]);

  const getDbUser = (id) => {
    DataStore.query(User, (user) => user.sub.eq(id))
      .then((users) => {
        setDbUser(users[0]);
      })
      .catch((err) => console.log(err));
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSignInPressed = async data => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const response = await Auth.signIn(data.username, data.password);
      console.log(response)
      getDbUser(response.attributes?.sub)
      navigation.navigate("HomeTabs")
    } catch (e) {
      Alert.alert('Oops', e.message);
    }
    setLoading(false);
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.scrollViewContent, { paddingBottom: bottomPadding }]}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={Logo}
          style={[styles.logo]}
          resizeMode="contain"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.titleText}>Let's Sign You In</Text>
          <Text style={styles.subtitleText}>Welcome back, you've been missed</Text>
        </View>
        <CustomInput
          name="username"
          placeholder="Username"
          control={control}
          rules={{ required: 'Username is required' }}
        />
        <CustomInput
          name="password"
          placeholder="Password"
          secureTextEntry
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 3,
              message: 'Password should be minimum 3 characters long',
            },
          }}
        />
        <CustomButton
          text={loading ? 'Loading...' : 'Sign In'}
          onPress={handleSubmit(onSignInPressed)}
        />

        <CustomButton
          text="Forgot password?"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />
        <CustomButton
          text="Don't have an account? Create one"
          onPress={onSignUpPress}
          type="TERTIARY"
        />
      </ScrollView>
      <View style={styles.developedByContainer}>
        <Text style={styles.developedByText}>Developed By GuruF</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: '100%',
    marginLeft: 10,
    height: 100,
  },
  infoContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "800",
    color: "black",
  },
  subtitleText: {
    fontSize: 14,
    color: "gray",
  },
  developedByContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  developedByText: {
    fontSize: 14,
    color: 'gray',
  },
});

export default SignInScreen;
