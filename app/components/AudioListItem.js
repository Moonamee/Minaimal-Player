import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import color from "../misc/color";
import font from "../misc/font";
import { useFonts } from "expo-font";

const getThumbnailText = (filename) => filename[0];

const convertTime = (minutes) => {
  if (minutes) {
    const hrs = minutes / 60;
    const minute = hrs.toString().split(".")[0];
    const percent = parseInt(hrs.toString().split(".")[1].slice(0, 2));
    const sec = Math.ceil((60 * percent) / 100);

    if (parseInt(minute) < 10 && sec < 10) {
      return `0${minute}:0${sec}`;
    }

    if (parseInt(minute) < 10) {
      return `0${minute}:${sec}`;
    }

    if (sec < 10) {
      return `${minute}:0${sec}`;
    }

    return `${minute}:${sec}`;
  }
};

const renderPlayPauseIcon = (isPlaying) => {
  if (isPlaying)
    return (
      <Entypo name="controller-paus" size={24} color={color.ACTIVE_FONT} />
    );
  return <Entypo name="controller-play" size={24} color={color.ACTIVE_FONT} />;
};

const AudioListItem = ({
  title,
  duration,
  onOptionPress,
  onAudioPress,
  isPlaying,
  activeListItem,
}) => {
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
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onAudioPress}>
          <View style={styles.leftContainer}>
            <View
              style={[
                styles.thumbnail,
                {
                  backgroundColor: activeListItem
                    ? color.APP_COLOR
                    : color.APP_BGRND_1,
                },
              ]}
            >
              <Text style={styles.thumbnailText}>
                {activeListItem
                  ? renderPlayPauseIcon(isPlaying)
                  : getThumbnailText(title)}
              </Text>
            </View>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>
              <Text style={styles.timeText}>{convertTime(duration)}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.rightContainer}>
          <Entypo
            onPress={onOptionPress}
            name="dots-three-vertical"
            size={20}
            color={color.APP_BGRND_0}
          />
        </View>
      </View>
    </>
  );
};
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    width: width - 55,
    borderRadius: 25,
    padding: 5,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightContainer: {
    marginRight: 9,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    height: 50,
    flexBasis: 50,
    backgroundColor: color.FONT_LIGHT,
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
  thumbnailText: {
    fontSize: 18,
    color: color.APP_LIGHTCOLOR,
    fontFamily: font.SemiCond_MEDIUM,
  },
  titleContainer: {
    width: width - 150,
    paddingLeft: 15,
  },
  title: {
    fontFamily: font.SemiCond_MEDIUM,
    fontSize: 16,
    color: color.APP_BGRND_1,
  },
  timeText: {
    fontFamily: font.SemiCond_MEDIUM,
    fontSize: 14,
    color: color.APP_BGRND_2,
  },
});

export default AudioListItem;
