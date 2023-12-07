import React from "react";
import { Ionicons } from "@expo/vector-icons";
import color from "../misc/color";

const PlayerButton = (props) => {
  const { iconType, size = 45, iconColor = color.APP_BGRND_1, onPress } = props;
  const getIconName = (type) => {
    switch (type) {
      case "PLAY":
        return "ios-pause-circle";
      case "PAUSE":
        return "ios-play-circle";
      case "NEXT":
        return "md-play-skip-forward";
      case "PREV":
        return "md-play-skip-back";
      case "RAND":
        return "shuffle";
      case "REPEAT":
        return "repeat";
    }
  };
  return (
    <Ionicons
      {...props}
      onPress={onPress}
      name={getIconName(iconType)}
      size={size}
      color={iconColor}
    />
  );
};

export default PlayerButton;
