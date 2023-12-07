import React from "react";
import { StyleSheet } from "react-native";
import color from "../misc/color";
import { LinearGradient } from "expo-linear-gradient";

const Screen = ({ children }) => {
  return (
    <LinearGradient
      style={styles.container}
      start={{ x: 0.9, y: 0.1 }}
      end={{ x: 0, y: 1 }}
      colors={["#dfdfdf", "#fff6e5", "#f1e9e9", "#9da7bb"]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    width: 380,
    alignSelf: "center",
    backgroundColor: color.APP_LIGHTCOLOR,
    borderRadius: 25,
    elevation: 10,
    shadowColor: color.APP_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export default Screen;
