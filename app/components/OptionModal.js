import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import color from "../misc/color";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import font from "../misc/font";
import { useFonts } from "expo-font";

const OptionModal = ({
  visible,
  currentItem,
  onClose,
  options,
  onPlayPress,
  onPlayListPress,
}) => {
  const { filename } = currentItem;

  const [loaded] = useFonts({
    OpenSansLight: require("../misc/Fonts/OpenSans_SemiCondensed-Light.ttf"),
    OpenSansRegular: require("../misc/Fonts/OpenSans_SemiCondensed-Regular.ttf"),
    OpenSansMedium: require("../misc/Fonts/OpenSans_SemiCondensed-Medium.ttf"),
    OpenSansBold: require("../misc/Fonts/OpenSans_SemiCondensed-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar
        visible
        backgroundColor={color.APP_BGRND_0}
        // barStyle="dark-content"
      />
      <Modal animationType="fade" transparent visible={visible}>
        <LinearGradient
          start={{ x: 0.9, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={["#380911", "#290e17", "#270a0e", "#3a0818"]}
          style={styles.modal}
        >
          <Text
            style={{
              color: color.APP_BG,
              fontSize: 18,
              textAlign: "center",
              fontFamily: font.SemiCond_BOLD,
            }}
          >
            Audio Settings
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {filename}
          </Text>
          <View style={styles.optionContainer}>
            {options.map((optn) => {
              return (
                <TouchableWithoutFeedback
                  key={optn.title}
                  onPress={optn.onPress}
                >
                  <Text style={styles.option}>{optn.title}</Text>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </LinearGradient>

        <TouchableWithoutFeedback onPress={onClose}>
          <BlurView intensity={70} tint="dark" style={styles.modalBg} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: color.APP_BGRND_0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1000,
    borderColor: color.APP_BG,
    borderBottomWidth: 2,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 30,
    marginBottom: 270,
  },
  optionContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: font.SemiCond_MEDIUM,
    textAlign: "center",
    padding: 20,
    paddingBottom: 20,
    color: color.APP_BG,
  },
  option: {
    fontSize: 17,
    fontFamily: font.SemiCond_MEDIUM,
    color: color.APP_BGRND_0,
    backgroundColor: color.APP_LIGHTCOLOR,
    paddingVertical: 10,
    width: 200,
    height: 50,
    alignSelf: "center",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    paddingTop: 14,
  },
  modalBg: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: color.MODAL_BG,
  },
});

export default OptionModal;
