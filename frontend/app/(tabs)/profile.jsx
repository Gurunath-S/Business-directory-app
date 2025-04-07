// Profile.jsx
import { View, Text, StyleSheet } from "react-native";
import React from "react";
import UserIntro from "../../components/Profile/UserIntro";
import MenuList from "../../components/Profile/MenuList";
import { Colors } from "../../constants/Colors"; // Assuming you still want to keep this for other uses
import { useUser } from "@clerk/clerk-expo";

export default function Profile() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={[styles.header, isAdmin && styles.adminHeader]}>
        <Text style={styles.headerText}>Profile</Text>
        <UserIntro />
      </View>

      {/* Menu List */}
      <View style={styles.menuContainer}>
        <MenuList />
      </View>

      {/* Admin Specific Section */}
      {isAdmin && (
        <View style={styles.adminSection}>
          <Text style={styles.adminText}>Welcome, Admin!</Text>
          {/* Add more admin-specific options or features here */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: Colors.PRIMARY, // Default header color
  },
  adminHeader: {
    backgroundColor: "red", // Admin header color
  },
  headerText: {
    fontFamily: "outfit-bold",
    fontSize: 32,
    color: "#fff",
  },
  menuContainer: {
    padding: 20,
  },
  adminSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ffdfba",
    borderRadius: 10,
    alignItems: "center",
  },
  adminText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d35400",
  },
});
