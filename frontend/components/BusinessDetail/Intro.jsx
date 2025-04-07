import { View, Text, Image, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import {React ,useCallback ,useState} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { doc, deleteDoc } from "firebase/firestore";
import { useUser } from '@clerk/clerk-expo';
import { db } from '../../configs/FirebaseConfig'; // Make sure you import your Firebase configuration

export default function Intro({ business }) {
  const [businesses, setBusinesses] = useState([]);
  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "BusinessList"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBusinesses(data);
      };
  
      fetchData();
    }, [])
  );

  const OnDelete = () => {
    Alert.alert(
      'Do you want to Delete?',
      'Do you really want to Delete this business?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteBusiness(),
        },
      ]
    );
  };

  const deleteBusiness = async () => {
    try {
      console.log("Deleting Business:", business?.id);
      await deleteDoc(doc(db, "BusinessList", business?.id)); // Corrected the collection name
      router.back();
      ToastAndroid.show('Business Deleted!', ToastAndroid.LONG);
    } catch (error) {
      console.error('Error deleting business:', error);
      ToastAndroid.show('Error deleting business!', ToastAndroid.LONG);
    }
  };

  return (
    <View>
      <View
        style={{
          position: 'absolute',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          padding: 25,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={35} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={35} color="white" />
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: business?.imageUrl }}
        style={{
          width: '100%',
          height: 300,
        }}
      />

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 20,
          marginTop: -20,
          backgroundColor: 'white',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
      >
        <View
          style={{
            padding: 20,
            marginTop: -20,
            backgroundColor: 'white',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontFamily: 'outfit-bold',
              marginLeft: -20,
            }}
          >
            {business?.name}
          </Text>
          <Text
            style={{
              fontFamily: 'outfit',
              fontSize: 15,
              marginLeft: -20,
            }}
          >
            {business?.address}
          </Text>
        </View>
        <View style={{marginLeft:-15}}>
        {(isAdmin||user?.primaryEmailAddress?.emailAddress === business?.userEmail) && (
          <TouchableOpacity onPress={OnDelete}>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        )}
        </View>
      </View>
    </View>
  );
}