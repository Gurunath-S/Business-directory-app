import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import BusinessListCard from '../../components/Explore/BusinessListCard';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function MyBusiness() {
  const { user } = useUser();
  const [businessList, setBusinessList] = useState([]);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const navigation = useNavigation();
  const isAdmin = user?.publicMetadata?.role === "admin";
  useEffect(() => {
    if (user) {
      // Configure header options for the screen
      navigation.setOptions({
        headerShown: true,
        headerTitle: 'My Business',
        headerStyle: {
          backgroundColor: isAdmin ? '#E90000' : Colors.PRIMARY,
        },
         headerTintColor: '#fff',
      });

      const q = query(
        collection(db, 'BusinessList'),
        where('userEmail', '==', user?.primaryEmailAddress?.emailAddress)
      );

      // Set up the listener for real-time updates
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const businesses = [];
        querySnapshot.forEach((doc) => {
          businesses.push({ id: doc.id, ...doc.data() });
        });

        if (businesses.length === 0) {
          Alert.alert('No Business Found');
        }

        setBusinessList(businesses);
        setLoading(false); // Set loading to false after data is fetched
      }, (error) => {
        console.error('Error fetching business list:', error);
        setLoading(false); // Set loading to false if an error occurs
      });

      // Clean up the listener on component unmount
      return () => unsubscribe();
    }
  }, [user, navigation]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontFamily: 'outfit-bold', fontSize: 25 }}>
        My Business
      </Text>

      {businessList.length === 0 && !loading ? (
        <View>
          <Text style={{ fontFamily: 'outfit', fontSize: 18, marginTop: 160, textAlign: 'center', color: Colors.GRAY }}>
            No businesses were added by you
          </Text>
        </View>
      ) : (
        <FlatList
          data={businessList}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          renderItem={({ item }) => (
            <BusinessListCard business={item} />
          )}
        />
      )}
    </View>
  );
}
