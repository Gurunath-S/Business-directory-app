import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as WebBrowser from "expo-web-browser";
import { useOAuth, clerkClient } from '@clerk/clerk-expo';
import axios from 'axios';
import { Colors } from '../constants/Colors';
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser';

if (Platform.OS !== 'web') {
  WebBrowser.maybeCompleteAuthSession();
}
export default function LoginScreen() {
  if (Platform.OS !== 'web') {
    const { useWarmUpBrowser } = require('../hooks/useWarmUpBrowser');
    useWarmUpBrowser();
  }
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });


  //handler function
  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
        } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);
  return (
    <View>
      <View style={styles.imageContainer}>
        <Image
          source={require('./../assets/images/og-home-page.jpeg')}
          style={styles.image}
        />
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.title}>
          Your Ultimate
          <Text style={styles.highlightedText}> Community Business Directory </Text>
          App
        </Text>
        <Text style={styles.description}>
          Find your favorite business near your area and post your own business to your community
        </Text>

        <TouchableOpacity style={styles.btn} onPress={onPress}>
          <Text style={styles.btnText}>Let's Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 50,
  },
  image: {
    width: 250,
    height: 540,
    borderRadius: 20,
    borderWidth: 6,
    borderColor: '#000',
  },
  subContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: -80,
  },
  title: {
    fontSize: 25,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
  },
  highlightedText: {
    color: Colors.PRIMARY,
  },
  description: {
    fontSize: 15,
    fontFamily: 'outfit',
    textAlign: 'center',
    marginVertical: 15,
    color: Colors.GRAY,
  },
  btn: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 99,
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'outfit',
  },
});

















// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
// import * as WebBrowser from "expo-web-browser";
// import { useOAuth, clerkClient } from '@clerk/clerk-expo';
// import axios from 'axios';
// import { Colors } from '../constants/Colors';
// import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser';
// if (Platform.OS !== 'web') {
//   WebBrowser.maybeCompleteAuthSession();
// }

// export default function LoginScreen() {
//   if (Platform.OS !== 'web') {
//     const { useWarmUpBrowser } = require('../hooks/useWarmUpBrowser');
//     useWarmUpBrowser();
//   }

//   const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

//   const onPress = React.useCallback(async () => {
//     try {
//       const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();

//       if (createdSessionId) {
//         setActive({ session: createdSessionId });

//         // Fetch user details from Clerk
//         const user = await clerkClient.users.getUser(createdSessionId);
//         const userDetails = {
//           clerkId: user.id,
//           email: user.emailAddresses[0].emailAddress,
//           name: `${user.firstName} ${user.lastName}`,
//         };

//         console.log('User details:', userDetails); // Log user details

//         // Save user details to the backend
//         await axios.post('http://localhost:3000/app/saveUser', userDetails);
//       } else {
//         // Use signIn or signUp for next steps such as MFA
//       }
//     } catch (err) {
//       console.error("OAuth error", err);
//     }
//   }, [startOAuthFlow]);

//   return (
//     <View>
//       <View style={styles.imageContainer}>
//         <Image
//           source={require('./../assets/images/home-page.jpeg')}
//           style={styles.image}
//         />
//       </View>

//       <View style={styles.subContainer}>
//         <Text style={styles.title}>
//           Your Ultimate
//           <Text style={styles.highlightedText}> Community Business Directory </Text>
//           App
//         </Text>
//         <Text style={styles.description}>
//           Find your favorite business near your area and post your own business to your community
//         </Text>

//         <TouchableOpacity style={styles.btn} onPress={onPress}>
//           <Text style={styles.btnText}>Let's Get Started</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   imageContainer: {
//     display: 'flex',
//     alignItems: 'center',
//     marginTop: 100,
//   },
//   image: {
//     width: 220,
//     height: 450,
//     borderRadius: 20,
//     borderWidth: 6,
//     borderColor: '#000',
//   },
//   subContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     marginTop: -40,
//   },
//   title: {
//     fontSize: 25,
//     fontFamily: 'outfit-bold',
//     textAlign: 'center',
//   },
//   highlightedText: {
//     color: Colors.PRIMARY,
//   },
//   description: {
//     fontSize: 15,
//     fontFamily: 'outfit',
//     textAlign: 'center',
//     marginVertical: 15,
//     color: Colors.GRAY,
//   },
//   btn: {
//     backgroundColor: Colors.PRIMARY,
//     padding: 10,
//     borderRadius: 99,
//     marginTop: 20,
//   },
//   btnText: {
//     textAlign: 'center',
//     color: '#fff',
//     fontFamily: 'outfit',
//   },
// });