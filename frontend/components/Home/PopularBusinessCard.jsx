import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

export default function PopularBusinessCard({ business }) {
  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  return (
    <TouchableOpacity
      onPress={() => router.push(`/businessdetail/${business?.id}`)}
      style={{
        marginLeft: 20,
        padding: 10,
        backgroundColor: isAdmin ? '#f9c8c8' : '#CBBBF9',
        borderRadius: 15,
        width: 220, // Set fixed width for the card
        
      }}
    >
      <Image
        source={{ uri: business?.imageUrl || 'https://via.placeholder.com/200' }}
        style={{
          width: '100%',
          height: 130,
          borderRadius: 15,
        }}
      />

      <View style={{ marginTop: 7, gap: 5 }}>
        <Text
          style={{
            fontFamily: 'outfit-bold',
            fontSize: 17,
          }}
        >
          {business?.name || 'Unnamed Business'}
        </Text>

        {/* Truncate the address if it's too long */}
        <Text
          numberOfLines={1} // Limit to 1 line
          ellipsizeMode="tail" // Add '...' if text overflows
          style={{
            fontFamily: 'outfit',
            fontSize: 13.5,
            color: '#fff',
            fontWeight:'bold',
            marginBottom: 5,
            flexShrink: 1, // Prevent other elements from expanding the card
          }}
        >
          {business?.address || 'No Address Available'}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <Image
            source={require('../../assets/images/star.png')}
            style={{ width: 15, height: 15, marginTop: 3 }}
          />
          <Text style={{ fontFamily: 'outfit', marginTop: 2 }}>4.5</Text>
        </View>

        <Text
          style={{
            fontFamily: 'outfit',
            backgroundColor: isAdmin ? '#E90000' : Colors.PRIMARY,
            color: '#fff',
            padding: 3,
            fontSize: 11,
            borderRadius: 5,
            fontWeight:'bold'
          }}
        >
          {business?.category || 'General'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
