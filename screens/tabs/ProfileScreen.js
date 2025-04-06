import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";

export default function ProfileScreen() {
  const auth = getAuth();
  const user = auth.currentUser;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (error) {
            console.error("Logout failed:", error.message);
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: user?.photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.displayName || "Guest User"}</Text>
        <Text style={styles.email}>{user?.email || "No email available"}</Text>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.options}>
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText}>📺 My Watchlist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText}>⭐ Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText}>⚙️ Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.optionItem, styles.logout]} onPress={handleLogout}>
          <Text style={[styles.optionText, { color: "#e74c3c" }]}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    alignItems: "center",
    backgroundColor: "#f0f2f5",
  },
  profileCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  editButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#3498db",
    borderRadius: 20,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  options: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    elevation: 2,
  },
  optionItem: {
    paddingVertical: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  logout: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
});
