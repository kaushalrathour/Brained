import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useDispatch, useSelector } from 'react-redux';
import { ScaledSheet } from 'react-native-size-matters';
import { ThemeState } from '../types/ThemeState';
import Container from '../components/Container';
import { setUser } from "../features/userSlice";
import Toast from 'react-native-toast-message';
import { LoginProps } from '../types/LoginProp';

export default function LoginScreen({ navigation }: LoginProps) {
  const { colors }: ThemeState = useSelector((state: any) => state.theme);
  const dispatch = useDispatch();

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      if (result.type === "cancelled") return;
      const userData = result.data?.user;
      dispatch(setUser(userData));
      Toast.show({
        text1: 'Success',
        text2: `Sign-in successful! Welcome, ${userData?.givenName}`,
        type: 'success',
      });
      setTimeout(() => {
        navigation.navigate("Home");
      }, 1000);
    } catch (error) {
      console.error(error);
      Toast.show({
        text1: 'Error',
        text2: 'Sign-in failed. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <Container>
      <View style={[styles.container]}>
        <View style={[styles.box, { backgroundColor: colors.backgroundSecondary, shadowColor: colors.shadowColor }]}>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your personal Todo manager
          </Text>
          <GoogleSigninButton
            style={styles.googleButton}
            size={GoogleSigninButton.Size.Wide}
            onPress={signInWithGoogle}
          />
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </View>
    </Container>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10@ms', // Adjusted padding to fit within the Container's padding
  },
  box: {
    width: '90%', // Adjust width as needed
    padding: '20@ms',
    borderRadius: '10@ms',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    alignItems: 'center',
  },
  logo: {
    width: '100@ms',
    height: '100@ms',
    marginBottom: '20@ms',
  },
  subtitle: {
    fontSize: '16@ms',
    marginBottom: '20@ms',
    textAlign: 'center',
  },
  googleButton: {
    width: '200@ms',
    height: '48@ms',
    marginBottom: '20@ms',
  },
  footerText: {
    fontSize: '12@ms',
    textAlign: 'center',
    marginTop: '20@ms',
  },
});
