import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, TouchableOpacity, Animated } from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import AudioList from "../screens/AudioList";
import Player from "../screens/Player";
import PlayList from "../screens/PlayList";
import PlayListDetail from "../screens/PlayListDetail";
import color from "../misc/color";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const NestedPlayListScreen = () => {
  // Изменил имя экрана на "NestedPlayListScreen"
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlayList" component={PlayList} />
      <Stack.Screen name="PlayListDetail" component={PlayListDetail} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: color.APP_LIGHTCOLOR,
        tabBarInactiveTintColor: color.APP_BG,
        tabBarStyle: {
          position: "absolute",
          elevation: 0,
          backgroundColor: color.APP_BGRND_0,
          height: 75,
          ...styles.shadow,
        },
      }}
    >
      <Tab.Screen
        name="Audio List"
        component={AudioList}
        options={{
          tabBarActiveBackgroundColor: color.APP_BGRND_2,
          headerShown: false,
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={props.style}
              activeOpacity={0.6}
            >
              <MaterialCommunityIcons
                name="folder-music"
                size={30}
                color={"#fff"}
                style={{
                  paddingBottom: 20,
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Player"
        component={Player}
        options={{
          tabBarActiveBackgroundColor: color.APP_BGRND_2,
          headerShown: false,
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={props.style}
              activeOpacity={0.6}
            >
              <FontAwesome5
                name="headphones-alt"
                size={50}
                color={"#fff"}
                style={{
                  paddingBottom: 10,
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="NestedPlayList" // Изменил имя экрана на "NestedPlayList"
        component={NestedPlayListScreen}
        options={{
          tabBarActiveBackgroundColor: color.APP_BGRND_2,
          headerShown: false,
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={props.style}
              activeOpacity={0.6}
            >
              <MaterialCommunityIcons
                name="folder-plus"
                size={30}
                color={"#fff"}
                style={{
                  paddingBottom: 20,
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export default AppNavigator;
