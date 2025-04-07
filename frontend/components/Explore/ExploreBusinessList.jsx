import { View, Text, FlatList } from 'react-native';
import React from 'react';
import BusinessListCard from './BusinessListCard';

export default function ExploreBusinessList({ businessList }) {
  return (
    <FlatList
      data={businessList}
      renderItem={({ item, index }) => (
        <BusinessListCard key={index} business={item} />
      )}
      ListFooterComponent={<View style={{ height: 400 }} />}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}
