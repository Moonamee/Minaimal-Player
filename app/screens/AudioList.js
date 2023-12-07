import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { AudioContext } from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import OptionModal from "../components/OptionModal";
import { Entypo } from "@expo/vector-icons";
import color from "../misc/color";
import { selectAudio } from "../misc/audioController";

export class AudioList extends Component {
  static contextType = AudioContext;
  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
      searchQuery: "",
    };
    this.currentItem = {};
  }

  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 75;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  handleSearch = (query) => {
    this.setState({ searchQuery: query });
  };

  handleAudioPress = async (audio) => {
    await selectAudio(audio, this.context);
  };

  componentDidMount() {
    this.context.loadPreviousAudio();
  }

  rowRenderer = (type, item, index, extendedState) => {
    if (
      this.state.searchQuery &&
      item.filename
        .toLowerCase()
        .indexOf(this.state.searchQuery.toLowerCase()) === -1
    ) {
      return null;
    }
    const title = item.filename.replace(/\.[^/.]+$/, "");
    return (
      <AudioListItem
        title={title}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
      />
    );
  };

  navigateToPlaylist = () => {
    this.context.updateState(this.context, {
      addToPlayList: this.currentItem,
    });
    this.props.navigation.navigate("PlayList");
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          if (!dataProvider._data.length) return null;
          return (
            <Screen>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              />
              <OptionModal
                options={[
                  {
                    title: "Добавить в плейлист",
                    onPress: this.navigateToPlaylist,
                  },
                ]}
                currentItem={this.currentItem}
                onClose={() =>
                  this.setState({ ...this.state, optionModalVisible: false })
                }
                visible={this.state.optionModalVisible}
              />
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  value={this.state.searchQuery}
                  onChangeText={this.handleSearch}
                />
                {this.state.searchQuery ? (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => this.setState({ searchQuery: "" })}
                  >
                    <Entypo
                      name="squared-cross"
                      size={25}
                      color={color.APP_BGRND_2}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 75,
    padding: 15,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: color.APP_BGRND_2,
    color: color.APP_BGRND_1,
    borderWidth: 2,
    fontSize: 16,
    paddingRight: 45,
    paddingLeft: 20,
    borderRadius: 20,
  },
  clearButton: {
    position: "absolute",
    left: 320,
    marginLeft: 5,
    // padding: 5,
  },
});

export default AudioList;
