import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import color from "../misc/color";
import { LinearGradient } from "expo-linear-gradient";

const PlayListInputModal = ({ visible, onClose, onSubmit }) => {
  const [playListName, setPlayListName] = useState("");

  const handleOnSubmit = () => {
    if (!playListName.trim()) {
      onClose();
    } else {
      onSubmit(playListName);
      setPlayListName("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <LinearGradient
          start={{ x: 0.9, y: 0.1 }}
          end={{ x: 0, y: 1 }}
          colors={["#440e1c", "#380b1a", "#31061f", "#27020a"]}
          style={styles.inputContainer}
        >
          <Text
            style={{
              color: color.APP_BG,
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            Create New Playlist
          </Text>
          <TextInput
            value={playListName}
            onChangeText={(text) => setPlayListName(text)}
            style={styles.input}
          />
          <AntDesign
            name="check"
            size={24}
            color={color.ACTIVE_FONT}
            style={styles.submitIcon}
            onPress={handleOnSubmit}
          />
        </LinearGradient>
      </View>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: width - 20,
    height: 200,
    borderRadius: 15,
    backgroundColor: color.ACTIVE_FONT,
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.APP_BG,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderRadius: 20,
    elevation: 10,
    shadowColor: color.APP_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  input: {
    marginTop: 20,
    width: width - 70,
    borderColor: color.APP_BG,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 10,
    fontSize: 18,
    paddingVertical: 5,
    color: color.APP_BGRND_0,
    padding: 10,
    backgroundColor: color.APP_LIGHTCOLOR,
  },
  submitIcon: {
    padding: 10,
    backgroundColor: color.APP_COLOR,
    borderRadius: 50,
    marginTop: 15,
    elevation: 10,
    shadowColor: color.APP_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  modalBG: {
    backgroundColor: color.MODAL_BG,
    zIndex: -1,
  },
});

export default PlayListInputModal;
