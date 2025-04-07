import { Text, View, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from "../../constants/Colors";
import Category from "../../components/Home/Category";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import ExploreBusinessList from "../../components/Explore/ExploreBusinessList";
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function Explore() {
  const [searchText, setSearchText] = useState(''); // State for search input
  const [businessList, setBusinessList] = useState([]); // State for storing businesses
  const [noResultsFound, setNoResultsFound] = useState(false); // State to track if no results are found
  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Function to capitalize the first letter of each word in a business name
  const capitalizeBusinessName = (name) => {
    return name
      .split(' ') // Split by spaces
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
      .join(' ');
  };

  // Function to fetch businesses by name
  const getBusinessByName = async (name) => {
    try {
      const normalizedName = name.trim().toLowerCase(); // Normalize the search text to lowercase

      // Query to fetch all businesses from the collection
      const q = query(collection(db, 'BusinessList'));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setNoResultsFound(true);
        setBusinessList([]);
      } else {
        const businesses = querySnapshot.docs.map((doc) => {
          const businessData = doc.data();
          const businessName = businessData.name;

          // Capitalize the business name after fetching it
          const formattedName = capitalizeBusinessName(businessName);

          // Return business object with formatted name and other details
          return {
            id: doc.id,
            name: formattedName,
            ...businessData
          };
        });

        // Filter businesses by normalized name (case-insensitive search)
        const filteredBusinesses = businesses.filter(business =>
          business.name.toLowerCase().includes(normalizedName)
        );

        // If no results match the search text, show "no results"
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

  // Effect to fetch businesses whenever the search text changes
  useEffect(() => {
    if (searchText.trim() === '') {
      setBusinessList([]); // Clear the list if search text is empty
      setNoResultsFound(false);
    } else {
      getBusinessByName(searchText); // Fetch businesses by name
    }
  }, [searchText]);

  // Function to fetch businesses by category
  const getBusinessByCategory = async (category) => {
    try {
      setBusinessList([]);
      setNoResultsFound(false);
      const q = query(collection(db, 'BusinessList'), where('category', '==', category));
      const querySnapshot = await getDocs(q);
      const businesses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      if (businesses.length === 0) {
        setNoResultsFound(true);
      } else {
        setNoResultsFound(false);
        setBusinessList(businesses);
      }
    } catch (error) {
      console.error('Error fetching businesses by category:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{
        backgroundColor: isAdmin ? '#E90000' : Colors.PRIMARY,
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}>
        <Text style={{
          fontFamily: 'outfit-bold',
          fontSize: 25,
          color: '#fff',
          marginBottom: 15,
        }}>
          Explore More
        </Text>

        {/* Search Bar */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: isAdmin ? '#E90000' : Colors.PRIMARY,
          paddingHorizontal: 10,
          width: '100%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        }}>
          <Ionicons name="search" size={20} color={isAdmin ? '#E90000' : Colors.PRIMARY} />
          <TextInput
            placeholder='Search...'
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
      </View>

      {/* Category */}
      <View style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
        <Category
          explore={true}
          onCategorySelect={(category) => getBusinessByCategory(category)}
        />
      </View>

      {/* Business List */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {noResultsFound ? (
          <Text style={{
            marginTop: 50,
            fontFamily: 'outfit',
            fontSize: 16,
            color: Colors.GRAY,
            textAlign: 'center',
          }}>
            No businesses found with that name or category.
          </Text>
        ) : (
          <ExploreBusinessList businessList={businessList} />
        )}
      </View>
    </View>
  );
}
