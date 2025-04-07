import { Text, View, ScrollView, FlatList } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/Home/Header';
import Slider from '../../components/Home/Slider';
import Category from '../../components/Home/Category';
import PopularBusiness from '../../components/Home/PopularBusiness';
import ExploreBusinessList from '../../components/Explore/ExploreBusinessList';
import { query, collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Colors } from '../../constants/Colors';
import { useFocusEffect } from '@react-navigation/native'; // 🔥 Import this

export default function Home({ user }) {
  const isAdmin = user?.publicMetadata?.role === 'admin';
  const [searchText, setSearchText] = useState('');
  const [businessList, setBusinessList] = useState([]);
  const [noResultsFound, setNoResultsFound] = useState(false);

  const fetchAllBusinesses = async () => {
    try {
      const q = query(collection(db, 'BusinessList'));
      const querySnapshot = await getDocs(q);

      const businesses = querySnapshot.docs.map((doc) => {
        const businessData = doc.data();
        const businessName = businessData.name;

        const formattedName = businessName
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        return {
          id: doc.id,
          name: formattedName,
          ...businessData,
        };
      });

      setBusinessList(businesses);
      setNoResultsFound(businesses.length === 0);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  // ✅ This runs every time the page comes into focus
  useFocusEffect(
    useCallback(() => {
      if (searchText.trim() === '') {
        fetchAllBusinesses();
      }
    }, [searchText])
  );

  const getBusinessByName = async (name) => {
    try {
      const normalizedName = name.trim().toLowerCase();
      const q = query(collection(db, 'BusinessList'));
      const querySnapshot = await getDocs(q);

      const businesses = querySnapshot.docs.map((doc) => {
        const businessData = doc.data();
        const businessName = businessData.name;

        const formattedName = businessName
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        return {
          id: doc.id,
          name: formattedName,
          ...businessData,
        };
      });

      const filteredBusinesses = businesses.filter((business) =>
        business.name.toLowerCase().includes(normalizedName)
      );

      if (filteredBusinesses.length === 0) {
        setNoResultsFound(true);
        setBusinessList([]);
      } else {
        setNoResultsFound(false);
        setBusinessList(filteredBusinesses);
      }
    } catch (error) {
      console.error('Error searching businesses by name:', error);
    }
  };

  // Search handler
  useEffect(() => {
    if (searchText.trim() === '') {
      fetchAllBusinesses();
    } else {
      getBusinessByName(searchText);
    }
  }, [searchText]);

  return (
    <ScrollView style={{ flex: 1 }}>
      <Header searchText={searchText} setSearchText={setSearchText} isAdmin={isAdmin} />

      {searchText.trim() ? (
        <View style={{ padding: 10 }}>
          {noResultsFound ? (
            <Text style={{ fontSize: 16, color: Colors.GRAY, textAlign: 'center' }}>
              No businesses found with that name or category.
            </Text>
          ) : (
            <FlatList
              data={businessList}
              renderItem={({ item }) => <ExploreBusinessList business={item} />}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 10 }}
            />
          )}
        </View>
      ) : (
        <>
          <Slider />
          <Category />
          <PopularBusiness />
        </>
      )}

      <View style={{ height: 15 }}></View>
    </ScrollView>
  );
}
