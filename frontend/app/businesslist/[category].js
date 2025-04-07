import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import BusinessListCard from '../../components/BusinessList/BusinessListCard';
import { Colors } from '../../constants/Colors';
import { useUser } from '@clerk/clerk-expo';

export default function BusinessListByCategory() {
  const navigation = useNavigation();
  const { user } = useUser();
  const { category } = useLocalSearchParams();
  const [businessList, setBusinessList] = useState([]);
  const [loading, setLoading] = useState(false);
  const isAdmin = user?.publicMetadata?.role === "admin";
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: category,
      headerStyle: {
        backgroundColor:  isAdmin ? 'red' : Colors.PRIMARY, // Set header background color
      },
      headerTintColor: '#fff',
    });
      
    getBusinessList();
  }, []);

  /**
   * used to get business list by category
   */
  const getBusinessList = async () => {
    setLoading(true);

    try {
      const q = query(collection(db, 'BusinessList'), where("category", '==', category));
      const querySnapshot = await getDocs(q);

      // Reset the businessList state before adding new data
      const newBusinessList = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        newBusinessList.push( {id:doc?.id, ...doc.data()});
      });

      setBusinessList(newBusinessList);
    } catch (error) {
      console.error("Error fetching business list:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {businessList?.length > 0 && loading == false ? (
        <FlatList
          data={businessList}
          onRefresh={getBusinessList}
          refreshing={loading}
          renderItem={({ item, index }) => (
            <BusinessListCard
              business={item}
              key={index}
            />
          )}
        />
      ) : loading ? (
        <ActivityIndicator
          style={{
            marginTop: '60%',
          }}
          size={'large'}
          color={Colors.PRIMARY}
        />
      ) : (
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'outfit-bold',
            color: Colors.GRAY,
            textAlign: 'center',
            marginVertical: 200,
          }}
        >
          No Business Found
        </Text>
      )}
    </View>
  );
}
