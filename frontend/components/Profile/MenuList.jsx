import React, { useEffect, useState } from 'react';
import { FlatList, Image, Share, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo'; // Using Clerk to get user info

export default function MenuList() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [menuList, setMenuList] = useState([]);
  const isAdmin = user?.publicMetadata?.role === "admin";
  useEffect(() => {
    // Populate the menu items dynamically based on the user's role
    const basicMenu = [
      {
        id: 1,
        name: "Add Business",
        icon: require('../../assets/images/add.png'),
        path: '/business/add-business',
      },
      {
        id: 2,
        name: "My Business",
        icon: require('../../assets/images/buildings.png'),
        path: '/business/my-business',
      },
      {
        id: 3,
        name: "Share App",
        icon: require('../../assets/images/share1.png'),
        path: 'share',
      },
      {
        id: 4,
        name: "Logout",
        icon: require('../../assets/images/log-out.png'),
        path: 'logout',
      },
    ];

    // If the user is an admin, add extra menu options
    if (user?.publicMetadata?.role === 'admin') {
      basicMenu.push(
        {
          id: 5,
          name: "All Businesses",
          icon: require('../../assets/images/all-business.png'), // Add a relevant icon
          path: '/admin/AllBusinesses',
        },
        {
          id: 6,
          name: "All Users",
          icon: require('../../assets/images/all-users.png'), // Add a relevant icon
          path: '/admin/all-users',
        }
      );
    }

    setMenuList(basicMenu);
  }, [user]);

  const onMenuClick = (item) => {
    if (item.path === 'logout') {
      signOut();
      return;
    }
    if (item.path === 'share') {
      Share.share({
        message: 'Download from my GitHub page but it is still in production!',
      });
      return;
    }
    router.push(item.path);
  };

  return (
    <View style={{ marginTop: 50 }}>
      <FlatList
        data={menuList}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onMenuClick(item)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              flex: 1,
              padding: 10,
              borderRadius: 15,
              borderWidth: 1,
              margin: 5,
              borderColor: isAdmin ? '#f9c8c8' : Colors.PRIMARY,
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Image
              source={item.icon}
              style={{
                width: 40,
                height: 40,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'outfit-medium',
                flex: 1,
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Text
        style={{
          fontFamily: 'outfit-bold',
          textAlign: 'center',
          marginTop: 100,
          color: Colors.GRAY,
        }}
      >
        Developed By Guru
      </Text>
    </View>
  );
}
