import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
const { width, height } = Dimensions.get("screen");

const IMAGE_SIZE = 80;
const SPACING = 10;

const API_KEY = "SECRET_KEY";

const API_URL =
  "https://api.pexels.com/v1/search?query=nature&orientation=portrait&size=small&per_page=20";

const fetchImagesApi = async () => {
  const data = await fetch(API_URL, {
    headers: {
      Authorization: API_KEY,
    },
  });

  const { photos } = await data.json();

  return photos;
};

export default function App() {
  const [images, setImages] = useState([]);
  useEffect(() => {
    const fetchImageApiCall = async () => {
      const images = await fetchImagesApi();
      setImages(images);
    };
    fetchImageApiCall();
  }, []);

  const mainRef = useRef();
  const tumbRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToActiveIndex = (index) => {
    setActiveIndex(index);
    mainRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
      tumbRef?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
        animated: true,
      });
    } else {
      tumbRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

  if (!images) {
    return <Text>Loading.....</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={mainRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onMomentumScrollEnd={(ev) => {
          scrollToActiveIndex(
            Math.round(ev.nativeEvent.contentOffset.x / width)
          );
        }}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image
                source={{ uri: item.src.portrait }}
                style={[StyleSheet.absoluteFillObject]}
              />
            </View>
          );
        }}
      />
      <FlatList
        ref={tumbRef}
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        style={{
          position: "absolute",
          bottom: IMAGE_SIZE,
        }}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => scrollToActiveIndex(index)}>
              <Image
                source={{ uri: item.src.portrait }}
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  borderRadius: 12,
                  marginRight: SPACING,
                  borderWidth: 2,
                  borderColor: activeIndex === index ? "#fff" : "transparent",
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
