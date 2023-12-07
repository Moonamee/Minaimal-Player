import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAudioForNextOpening = async (audio, index, lastPosition) => {
  try {
    await AsyncStorage.setItem(
      "previousAudio",
      JSON.stringify({ audio: { ...audio, lastPosition }, index })
    );
  } catch (error) {
    console.log("Error storing audio for next opening:", error);
  }
};

export const convertTime = (minutes) => {
  if (minutes) {
    const hrs = minutes / 60;
    const minute = Math.floor(hrs);
    const percent = parseInt((hrs % 1).toFixed(2) * 100);
    const sec = Math.ceil((60 * percent) / 100);
    const formattedMinute = String(minute).padStart(2, "0");
    const formattedSec = String(sec).padStart(2, "0");
    return `${formattedMinute}:${formattedSec}`;
  }
};
