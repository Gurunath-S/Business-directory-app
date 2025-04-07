import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import BusinessListCard from '../../components/BusinessList/BusinessListCard';
import { Colors } from '../../constants/Colors';

export default function AllBusinesses() {
  const navigation = useNavigation();
  const { category } = useLocalSearchParams();

  const [businessList, setBusinessList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "All Businesses",
      headerStyle: { backgroundColor: 'red' },
      headerTintColor: '#fff',
    });

    fetchBusinessList();
  }, [category]); // Add category as a dependency to refetch if it changes

  const fetchBusinessList = async () => {
    setLoading(true);

    try {
      const q = query(collection(db, 'BusinessList'));
      const querySnapshot = await getDocs(q);

      const businesses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBusinessList(businesses);
    } catch (error) {
      console.error("Error fetching business list:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderEmptyList = () => (
    <Text
      style={{
        fontSize: 20,
        fontFamily: 'outfit-bold',
        color: Colors.GRAY,
        textAlign: 'center',
        marginVertical: 400,
      }}
    >
      No Business Found
    </Text>
  );

  const renderContent = () => (
    <FlatList
      data={businessList}
      onRefresh={fetchBusinessList}
      refreshing={loading}
      renderItem={({ item }) => <BusinessListCard business={item} />}
      ListEmptyComponent={renderEmptyList}
    />
  );

  return (
    <View style={{ flex: 1, padding: 5 }}>
      {loading ? (
        <ActivityIndicator
          style={{ marginTop: '60%' }}
          size="large"
          color={Colors.PRIMARY}
        />
      ) : (
        renderContent()
      )}
    </View>
  );
}
