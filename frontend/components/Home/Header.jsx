import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { query, collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import ExploreBusinessList from '../../components/Explore/ExploreBusinessList';

export default function Header({ searchText, setSearchText }) {
  const { user } = useUser();
  const [businessList, setBusinessList] = useState([]);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Capitalize business name
  const capitalizeBusinessName = (name) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Fetch businesses based on search text
  const getBusinessByName = async (name) => {
    try {
      const normalizedName = name.trim().toLowerCase(); // Normalize the search text to lowercase
      const q = query(collection(db, 'BusinessList'));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setNoResultsFound(true);
        setBusinessList([]);
      } else {
        const businesses = querySnapshot.docs.map((doc) => {
          const businessData = doc.data();
          const businessName = businessData.name;
          const formattedName = capitalizeBusinessName(businessName);
          return { id: doc.id, name: formattedName, ...businessData };
        });

        const filteredBusinesses = businesses.filter((business) =>
          business.name.toLowerCase().includes(normalizedName)
        );

        if (filteredBusinesses.length === 0) {
          setNoResultsFound(true);
        } else {
          setNoResultsFound(false);
          setBusinessList(filteredBusinesses);
        }
      }
    } catch (error) {
      console.error('Error searching businesses by name:', error);
    }
  };

  // Update business list on search text change
  useEffect(() => {
    if (searchText.trim() === '') {
      setBusinessList([]);
      setNoResultsFound(false);
    } else {
      getBusinessByName(searchText); // Fetch businesses based on search text
    }
  }, [searchText]);

  return (
    <View
      style={{
        padding: 20,
        paddingTop: 40,
        backgroundColor: isAdmin ? '#E90000' : Colors.PRIMARY,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      {/* Header content */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image
            source={{ uri: user?.imageUrl }}
            style={{ width: 45, height: 45, borderRadius: 45 / 2 }}
          />
          <View>
            {isAdmin ? (
              <View>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Welcome</Text>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Admin</Text>
                <Text style={{ fontSize: 19, color: '#fff', fontFamily: 'outfit-medium' }}>
                  {user?.fullName}
                </Text>
              </View>
            ) : (
              <View>
                <Text style={{ color: '#fff' }}>Hello,</Text>
                <Text style={{ fontSize: 19, color: '#fff', fontFamily: 'outfit-medium' }}>
                  {user?.fullName}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          backgroundColor: '#fff',
          marginVertical: 10,
          marginTop: 15,
          borderRadius: 8,
        }}
      >
        <Ionicons
          name="search"
          size={20}
          color={isAdmin ? 'red' : Colors.PRIMARY}
          style={{ marginHorizontal: 10 }}
        />
        <TextInput
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
          style={{
            fontFamily: 'outfit',
            fontSize: 16,
            flex: 1,
            padding: 8,
            color: Colors.PRIMARY,
          }}
        />
      </View>

      {/* Search Results (below header) */}
      {searchText.trim() && (
        <View style={{ marginTop: 20, maxHeight: 190 }}>
          {noResultsFound ? (
            <Text
              style={{
                fontFamily: 'outfit',
                fontSize: 16,
                color: Colors.GRAY,
                textAlign: 'center',
              }}
            >
              No businesses found with that name or category.
            </Text>
          ) : (
            <ExploreBusinessList businessList={businessList} />
          )}
        </View>
      )}
    </View>
  );
}
