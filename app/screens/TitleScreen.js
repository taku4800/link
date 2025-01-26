import * as React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

export default function TitleScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    'HachiMaruPop-Regular': require('../../assets/fonts/HachiMaruPop-Regular.ttf'),
    'RocknRollOne-Regular': require('../../assets/fonts/RocknRollOne-Regular.ttf'),
    'DelaGothicOne-Regular': require('../../assets/fonts/DelaGothicOne-Regular.ttf'),
    'MPLUS2-SemiBold': require('../../assets/fonts/MPLUS2-SemiBold.ttf'),
    'KaiseiHarunoUmi-Bold': require('../../assets/fonts/KaiseiHarunoUmi-Bold.ttf'),
    'MPLUSRounded1c-Bold': require('../../assets/fonts/MPLUSRounded1c-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Home', { fromTitle: true })}>
      
      <ImageBackground source={require('../image/image_g2.png')} style={styles.backgroundImage}>
        <Text style={styles.title}>リンク</Text>
        <View style={styles.imageContainer}>
          <Image source={require('../image/title.png')} style={styles.image} />
        </View>
        <Text style={styles.tapText}>画面をタップ！</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 80,
    marginBottom: 20,
    top: -10,
    fontFamily: 'DelaGothicOne-Regular', // フォントを適用
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: 200,
    height: 260,
    top: 22,
    resizeMode: 'contain',
  },
  tapText: {
    fontSize: 16,
    marginTop: 20,
    fontFamily: 'DelaGothicOne-Regular', // フォントを適用
  },
});