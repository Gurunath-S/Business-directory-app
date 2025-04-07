import { ClerkProvider, SignedOut, SignedIn, useUser } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import LoginScreen from '../components/LoginScreen';
import * as SecureStore from "expo-secure-store";
// import Constants from 'expo-constants';
import { useEffect } from 'react';
// import { View, Text } from 'react-native';
import apikey from '../configs/Apikey'
const tokenCache = {
  async getToken(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.error('Error getting token from SecureStore:', err);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error('Error saving token to SecureStore:', err);
    }
  },
};

const storeUserDetails = async (user) => {
  try {
    console.log('Sending user details:', user);
    const response = await fetch(`http://${apikey}:5000/api/saveUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Failed to save user details to MongoDB: ${response.statusText}`);
    }

    console.log('User details saved successfully:', user);
  } catch (err) {
    console.error('Network request failed:', err);
  }
};
function UserDetails() {
  const { user, session } = useUser(); // Clerk hook to get the authenticated user details

  useEffect(() => {
    if (user) {
      const userDetails = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        username: user.username,
        email: user.primaryEmailAddress.emailAddress, // Adjust based on the structure
        phoneNumber: user.primaryPhoneNumber, // Adjust based on the structure
        imageUrl: user.imageUrl,
        hasImage: user.hasImage,
        lastSignInAt: user.lastSignInAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
  
      console.log('Storing user details:', userDetails);
      storeUserDetails(userDetails);
    } else {
      console.error('User is undefined.');
    }
  }, [user, session]);

  return null; // This component does not render anything
}

function RootLayout() {
  const [fontsLoaded] = useFonts({
    'outfit': require('../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Don't render anything until fonts are loaded
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <SignedIn>
        <UserDetails />
        <Stack
           screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="/(tabs)/home"
          />
        </Stack>
      </SignedIn>
      <SignedOut>
        <LoginScreen />
      </SignedOut>
    </ClerkProvider>
  );
}


export default RootLayout;
