import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";

const TopTab = createMaterialTopTabNavigator();

const ListScreen = ({ status }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{status} List</Text>
  </View>
);

const MyListTabs = () => (
  <TopTab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: "#2D4DA7", paddingVertical: 2 }, // Reduced padding
      tabBarIndicatorStyle: { backgroundColor: "white" },
      tabBarLabelStyle: { color: "white", fontWeight: "bold" },
      tabBarScrollEnabled: true,
    }}
  >
    <TopTab.Screen name="All">
      {() => <ListScreen status="All" />}
    </TopTab.Screen>
    <TopTab.Screen name="Watching">
      {() => <ListScreen status="Watching" />}
    </TopTab.Screen>
    <TopTab.Screen name="Completed">
      {() => <ListScreen status="Completed" />}
    </TopTab.Screen>
    <TopTab.Screen name="On Hold">
      {() => <ListScreen status="On Hold" />}
    </TopTab.Screen>
    <TopTab.Screen name="Dropped">
      {() => <ListScreen status="Dropped" />}
    </TopTab.Screen>
    <TopTab.Screen name="Plan to Watch">
      {() => <ListScreen status="Plan to Watch" />}
    </TopTab.Screen>
  </TopTab.Navigator>
);

export default function MyListScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <MyListTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});