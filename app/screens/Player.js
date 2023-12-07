import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import Screen from "../components/Screen";
import color from "../misc/color";
import { AudioContext } from "../context/AudioProvider";
import PlayerButton from "../components/PlayerButton";
import {
  changeAudio,
  moveAudio,
  pause,
  play,
  playNext,
  resume,
  randomAudio,
  selectAudio,
} from "../misc/audioController";
import { convertTime, storeAudioForNextOpening } from "../misc/helper";
import { Audio } from "expo-av";

const { width } = Dimensions.get("window");

const Player = () => {
  const [audioFormat, setAudioFormat] = useState(null);

  const [currentPosition, setCurrentPosition] = useState(0);
  const [randomSwitchValue, setRandomSwitchValue] = useState(false);
  const [lastSwitchedIndex, setLastSwitchedIndex] = useState(-1); // Добавленная переменная для хранения индекса последнего переключенного трека
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration, currentAudio } = context;
  const calculateSeebBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }
    if (currentAudio.lastPosition) {
      return currentAudio.lastPosition / (currentAudio.duration * 1000);
    }
    return 0;
  };

  useEffect(() => {
    context.loadPreviousAudio();
  }, []);

  useEffect(() => {
    if (context.currentAudio) {
      getAudioFormat();
    }
  }, [context.currentAudio]);

  const handleRepeat = async () => {
    await repeatAudio(context, "repeat");
  };

  const handlePlayPause = async () => {
    await selectAudio(context.currentAudio, context);
  };

  const handleNext = async () => {
    if (randomSwitchValue) {
      const randomIndex = Math.floor(Math.random() * context.audioFiles.length);
      const randomAudio = context.audioFiles[randomIndex];
      await selectAudio(randomAudio, context);
      setLastSwitchedIndex(context.currentAudioIndex);
    } else {
      const nextAudioIndex = context.currentAudioIndex + 1;
      if (nextAudioIndex < context.audioFiles.length) {
        const nextAudio = context.audioFiles[nextAudioIndex];
        await selectAudio(nextAudio, context);
      } else {
        const firstAudio = context.audioFiles[0];
        await selectAudio(firstAudio, context);
      }
    }
  };

  const handlePrevious = async () => {
    if (randomSwitchValue) {
      if (lastSwitchedIndex !== -1) {
        const lastSwitchedAudio = context.audioFiles[lastSwitchedIndex];
        await selectAudio(lastSwitchedAudio, context);
      }
    } else {
      const previousAudioIndex = context.currentAudioIndex - 1;
      if (previousAudioIndex >= 0) {
        const previousAudio = context.audioFiles[previousAudioIndex];
        await selectAudio(previousAudio, context);
      } else {
        const lastAudioIndex = context.totalAudioCount - 1;
        const lastAudio = context.audioFiles[lastAudioIndex];
        await selectAudio(lastAudio, context);
      }
    }
  };

  const handleRandomSwitch = () => {
    setRandomSwitchValue((prevValue) => !prevValue);
  };

  //______________FORMAT____________________//

  const getAudioFormat = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: currentAudio.uri,
      });
      const status = await sound.getStatusAsync();
      const format = status?.uri?.split(".").pop();
      setAudioFormat(format);
      console.log("Audio Format:", format);
    } catch (error) {
      console.log("Ошибка при получении формата аудиофайла:", error);
    }
  };

  const renderCurrentTime = () => {
    if (!context.soundObj && currentAudio.lastPosition) {
      return convertTime(currentAudio.lastPosition / 1000);
    }
    return convertTime(context.playbackPosition / 1000);
  };

  //________________BITRATE___________________//

  //________________BITRATE___________________//

  if (!context.currentAudio) return null;
  const [scaleValue] = useState(new Animated.Value(1));

  //-------------------ANIMATED----------------//
  const animateButton = () => {
    Animated.timing(scaleValue, {
      toValue: 0.9,
      duration: 1,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
  };
  //-------------------ANIMATED----------------//

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.audioCountContainer}>
          <View style={{ flexDirection: "row" }}>
            {context.isPlayListRunning && (
              <>
                <Text style={{ fontWeight: "bold", color: color.APP_BGRND_1 }}>
                  From Playlist:{" "}
                </Text>
                <Text style={{ color: color.APP_BGRND_2 }}>
                  {context.activePlayList.title}
                </Text>
              </>
            )}
          </View>
          <Text style={styles.audioCount}>{`${
            context.currentAudioIndex + 1
          } / ${context.totalAudioCount}`}</Text>
        </View>
        <View style={styles.bannerContainer}>
          <LinearGradient
            start={{ x: 0.9, y: 0.1 }}
            end={{ x: 0, y: 1 }}
            colors={["#68172b", "#470b1f", "#360321", "#27020a"]}
            style={styles.midBannerContainer}
          >
            <MaterialCommunityIcons
              name="music-box"
              size={200}
              color={
                context.isPlaying
                  ? color.APP_LIGHTCOLOR
                  : color.APP_LIGHTCOLOR_1
              }
            />
          </LinearGradient>
        </View>

        <View style={styles.audioPlayerContainer}>
          <View style={styles.audioTitleContainer}>
            <Text numberOfLines={2} style={styles.audioTitle}>
              {context.currentAudio.filename.replace(/\.[^/.]+$/, "")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                padding: 10,
              }}
            >
              <Text style={{ color: color.APP_BGRND_1, opacity: 0.7 }}>
                Format:
              </Text>
              <Text
                style={{
                  color: color.APP_BGRND_2,
                  paddingRight: 7,
                  paddingLeft: 7,
                }}
              >
                {audioFormat}
              </Text>
              <Text style={{ color: color.APP_BGRND_3, paddingRight: 10 }}>
                |
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 24,
            }}
          >
            <View style={styles.timeDurationContainer}>
              <Text style={styles.timeDurationStyle}>
                {currentPosition ? currentPosition : renderCurrentTime()}
              </Text>
            </View>
            <View style={styles.timeDurationContainer}>
              <Text style={styles.timeDurationStyle}>
                {convertTime(context.currentAudio.duration)}
              </Text>
            </View>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            thumbTintColor={color.APP_BGRND_1}
            value={calculateSeebBar()}
            minimumTrackTintColor={color.APP_BGRND_1}
            maximumTrackTintColor={color.APP_COLOR}
            onValueChange={(value) => {
              setCurrentPosition(
                convertTime(value * context.currentAudio.duration)
              );
            }}
            onSlidingStart={async () => {
              if (!context.isPlaying) return;
              try {
                await pause(context.playbackObj);
              } catch (error) {
                console.log("error inside onSlidingStart callback", error);
              }
            }}
            onSlidingComplete={async (value) => {
              await moveAudio(context, value);
              setCurrentPosition(0);
            }}
          />
          <View style={styles.audioControllers}>
            <PlayerButton
              size={22}
              iconType="REPEAT"
              onPress={handleRepeat}
              style={styles.repBtn}
            />
            <TouchableOpacity onPress={handlePrevious}>
              <PlayerButton iconType="PREV" />
            </TouchableOpacity>
            <TouchableWithoutFeedback
              onPressIn={animateButton}
              onPressOut={handlePlayPause}
            >
              <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
                <PlayerButton
                  style={styles.buttonPlayPause}
                  size={80}
                  iconType={context.isPlaying ? "PLAY" : "PAUSE"}
                />
              </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableOpacity onPress={handleNext}>
              <PlayerButton iconType="NEXT" />
            </TouchableOpacity>
            <View style={styles.randomSwitchContainer}>
              <TouchableOpacity onPress={handleRandomSwitch}>
                <Ionicons
                  name={randomSwitchValue ? "shuffle" : "swap-horizontal"}
                  size={25}
                  color={
                    randomSwitchValue ? color.APP_BGRND_1 : color.APP_BGRND_2
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  slider: {
    width: "100%",
    height: 50,
    alignSelf: "center",
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  buttonPlayPause: {
    padding: 5,
  },
  randBtn: {
    color: color.APP_COLOR,
  },
  repBtn: {
    color: color.APP_COLOR,
  },
  audioControllers: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingBottom: 110,
    paddingTop: 25,
  },
  audioCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  container: {
    flex: 1,
  },
  audioCount: {
    textAlign: "right",
    color: color.APP_BGRND_2,
    fontSize: 14,
  },
  bannerContainer: {
    flex: 1,
    alignItems: "center",
  },
  midBannerContainer: {
    flex: 1,
    width: width - 50,
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.APP_BG,
    borderBottomWidth: 4,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderRadius: 20,
    elevation: 10,
    shadowColor: color.APP_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    // margin: 15,
  },
  audioTitleContainer: {
    alignItems: "center",
  },
  audioTitle: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: color.APP_BGRND_1,
    width: "90%",
    height: 100,
  },
  timeDurationContainer: {
    width: 55,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.APP_BGRND_2,
    borderRadius: 10,
    elevation: 4,
    shadowColor: color.APP_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  timeDurationStyle: {
    color: color.APP_BG,
    fontSize: 13,
  },
});
export default Player;
