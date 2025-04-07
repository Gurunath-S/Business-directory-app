// app/(tabs)/_layout.jsx
import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from "../../constants/Colors";
import { useUser } from '@clerk/clerk-expo';

export default function TabLayout() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isAdmin ? '#E90000' : Colors.PRIMARY,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="home"
              size={24}
              color={isAdmin ? '#E90000' : Colors.PRIMARY}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="search-sharp"
              size={24}
              color={isAdmin ? '#E90000' : Colors.PRIMARY}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="people"
              size={24}
              color={isAdmin ? '#E90000' : Colors.PRIMARY}
            />
          ),
        }}
      />
    </Tabs>
  );
}
