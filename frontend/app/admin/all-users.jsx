import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
// import { Colors } from '../../constants/Colors';
import apikey from '../../configs/Apikey';
export default function UserList() {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users and set the header title
  useEffect(() => {
  
    navigation.setOptions({
      headerTitle: 'All Users',
      headerStyle: {
        backgroundColor: 'red', // Set header background color
      },
      headerTintColor: '#fff',
    });

    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://${apikey}:5000/api/users`); // Update with your backend URL
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers(); // Call the function inside useEffect
  }, [navigation]); // Run once when the component mounts

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User List</Text>
      <FlatList
      showsVerticalScrollIndicator={false}
        data={users}
        keyExtractor={(item) => item.id.toString()} // Ensure id is a string
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.userImage} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={styles.userPhone}>{item.phoneNumber || 'No phone number'}</Text>
              <Text style={styles.userEmail}>Last seen 👇 {item.lastSignInAt}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  userPhone: {
    fontSize: 12,
    color: '#999',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});
