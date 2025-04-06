import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/tabs/HomeScreen";
import DiscussionScreen from "./screens/tabs/DiscussionScreen";
import DiscoverScreen from "./screens/tabs/DiscoverScreen";
import SeasonalScreen from "./screens/tabs/SeasonalScreen";
import MyListScreen from "./screens/tabs/MyListScreen";
import ProfileScreen from "./screens/tabs/ProfileScreen";

// Authentication Stack
const AuthStack = createNativeStackNavigator();
function AuthScreensNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// Bottom Tabs Navigator
const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: "home",
            Discussion: "message-text",
            Discover: "compass",
            Seasonal: "leaf",
            MyList: "format-list-bulleted-square",
            Profile: "account",
          };
          return (
            <MaterialCommunityIcons
              name={icons[route.name]}
              color={color}
              size={size}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discussion" component={DiscussionScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Seasonal" component={SeasonalScreen} />
      <Tab.Screen name="MyList" component={MyListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main App Component with Authentication Check
export default function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserLoggedIn(!!user); // Automatically updates on login/logout
    });
    return unsubscribe; // Cleanup on unmount
  }, []);

  return (
    <NavigationContainer>
      {isUserLoggedIn ? <MyTabs /> : <AuthScreensNavigator />}
    </NavigationContainer>
  );
}
