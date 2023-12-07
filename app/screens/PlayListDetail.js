import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { selectAudio } from "../misc/audioController";
import color from "../misc/color";
import AudioListItem from "../components/AudioListItem";
import { AudioContext } from "../context/AudioProvider";
import OptionModal from "../components/OptionModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

const PlayListDetail = (props) => {
  const context = useContext(AudioContext);
  const playList = props.route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [audios, setAudios] = useState(playList.audios);

  const playAudio = async (audio) => {
    await selectAudio(audio, context, {
      activePlayList: playList,
      isPlayListRunning: true,
    });
  };

  const closeModal = () => {
    setSelectedItem({});
    setModalVisible(false);
  };
  const removeAudio = async () => {
    let isPlaying = context.isPlaying;
    let isPlayListRunning = context.isPlayListRunning;
    let soundObj = context.soundObj;
    let playbackPosition = context.playbackPosition;
    let activePlayList = context.activePlayList;

    if (
      context.isPlayListRunning &&
      context.currentAudio.id === selectedItem.id
    ) {
      // stop
      await context.playbackObj.stopAsync();
      await context.playbackObj.unloadAsync();
      isPlaying = false;
      isPlayListRunning = false;
      soundObj = null;
      playbackPosition = 0;
      activePlayList = [];
    }

    const newAudios = audios.filter((audio) => audio.id !== selectedItem.id);
    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const oldPlayLists = JSON.parse(result);
      const updatedPlayLists = oldPlayLists.filter((item) => {
        if (item.id === playList.id) {
          item.audios = newAudios;
        }

        return item;
      });

      AsyncStorage.setItem("playlist", JSON.stringify(updatedPlayLists));
      context.updateState(context, {
        playList: updatedPlayLists,
        isPlayListRunning,
        activePlayList,
        playbackPosition,
        isPlaying,
        soundObj,
      });
    }

    setAudios(newAudios);
    closeModal();
  };

  const removePlaylist = async () => {
    let isPlaying = context.isPlaying;
    let isPlayListRunning = context.isPlayListRunning;
    let soundObj = context.soundObj;
    let playbackPosition = context.playbackPosition;
    let activePlayList = context.activePlayList;

    if (context.isPlayListRunning && activePlayList.id === playList.id) {
      // stop
      await context.playbackObj.stopAsync();
      await context.playbackObj.unloadAsync();
      isPlaying = false;
      isPlayListRunning = false;
      soundObj = null;
      playbackPosition = 0;
      activePlayList = [];
    }

    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const oldPlayLists = JSON.parse(result);
      const updatedPlayLists = oldPlayLists.filter(
        (item) => item.id !== playList.id
      );

      AsyncStorage.setItem("playlist", JSON.stringify(updatedPlayLists));
      context.updateState(context, {
        playList: updatedPlayLists,
        isPlayListRunning,
        activePlayList,
        playbackPosition,
        isPlaying,
        soundObj,
      });
    }

    props.navigation.goBack();
  };

  return (
    <LinearGradient
      start={{ x: 1, y: 0.1 }}
      end={{ x: 0, y: 1 }}
      colors={["#dfdfdf", "#fff6e5", "#f1e9e9", "#9da7bb"]}
      style={styles.contentContainer}
    >
      <Text style={styles.title}>{playList.title}</Text>
      <ScrollView style={styles.container}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            paddingHorizontal: 15,
          }}
        ></View>
        {audios.length ? (
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={audios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 10 }}>
                <AudioListItem
                  title={item.filename}
                  duration={item.duration}
                  isPlaying={context.isPlaying}
                  activeListItem={item.id === context.currentAudio.id}
                  onAudioPress={() => playAudio(item)}
                  onOptionPress={() => {
                    setSelectedItem(item);
                    setModalVisible(true);
                  }}
                />
              </View>
            )}
          />
        ) : (
          <Text
            style={{
              textAlign: "center",
              color: color.APP_BGRND_4,
              fontSize: 18,
              paddingTop: 200,
            }}
          >
            Sorry, there are no tracks here.
          </Text>
        )}
      </ScrollView>

      <View>
        <TouchableOpacity onPress={removePlaylist}>
          <Text style={[styles.titleRemovePlaylist]}>Delate Playlist</Text>
        </TouchableOpacity>
      </View>

      <OptionModal
        visible={modalVisible}
        onClose={closeModal}
        options={[{ title: "Remove from playlist", onPress: removeAudio }]}
        currentItem={selectedItem}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    position: "absolute",
    marginTop: 5,
    width: "92%",
    height: "90%",
    alignSelf: "center",
    borderRadius: 25,
    // borderTopLeftRadius: 25,
    // borderTopRightRadius: 25,
    elevation: 10,
    shadowColor: color.APP_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },

  container: {
    // width: "100%",
    overflow: "hidden",
  },
  listContainer: {
    padding: 20,
  },
  title: {
    backgroundColor: color.APP_BGRND_0,
    // paddingTop: 15,
    padding: 5,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    textAlign: "center",
    width: "100%",
    height: 60,
    color: color.APP_BG,
    fontWeight: "bold",
    fontSize: 15,
    elevation: 10,
    shadowColor: color.APP_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    textAlignVertical: "center",
  },
  titleRemovePlaylist: {
    position: "absolute",
    bottom: 0,
    textAlign: "center",
    textAlignVertical: "center",
    // borderTopLeftRadius: 25,
    // borderTopRightRadius: 25,
    borderRadius: 20,
    fontSize: 16,
    paddingVertical: 5,
    fontWeight: "bold",
    color: color.APP_LIGHTCOLOR,
    width: "100%",
    height: 50,
    backgroundColor: color.APP_BGRND_0,
  },
});

export default PlayListDetail;
