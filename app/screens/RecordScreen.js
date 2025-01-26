import * as React from 'react';
import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { Audio } from 'expo-av';

export default function AdviceScreen({ navigation }) {
  const { width, height } = Dimensions.get('window');
  let [fontsLoaded] = useFonts({
    'MPLUSRounded1c-Regular': require('../../assets/fonts/MPLUSRounded1c-Regular.ttf'),
    'RocknRollOne-Regular': require('../../assets/fonts/RocknRollOne-Regular.ttf'),
    'MPLUSRounded1c-Bold': require('../../assets/fonts/MPLUSRounded1c-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <ImageBackground source={require('../image/image_g2.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.bubbleContainer}>
          <Svg height={height * 1} width={width * 0.9} viewBox="0 0 100 150" style={styles.bubble}>
            <Path
              d="M0 0 H 100 V 130 H 60 L 30 140 L 40 130 H 0 Z"
              fill="rgba(255, 182, 193, 0.8)"
            />
          </Svg>
          <View style={styles.bubbleTextContainer}>
            <View style={styles.bubbleArea}>
              <View style={styles.meterContainer}>
                <Text style={styles.meterLabel}>総合スコア　80</Text>
                <View style={styles.meterBackground}>
                  <View style={[styles.meterFill, { width: '80%' }]} />
                </View>
              </View>
              <View style={styles.meterContainer}>
                <Text style={styles.meterLabel}>睡眠　70</Text>
                <View style={styles.meterBackground}>
                  <View style={[styles.meterFill, { width: '70%' }]} />
                </View>
              </View>
              <View style={styles.meterContainer}>
                <Text style={styles.meterLabel}>運動　80</Text>
                <View style={styles.meterBackground}>
                  <View style={[styles.meterFill, { width: '80%' }]} />
                </View>
              </View>
              <View style={styles.meterContainer}>
                <Text style={styles.meterLabel}>食事　90</Text>
                <View style={styles.meterBackground}>
                  <View style={[styles.meterFill, { width: '90%' }]} />
                </View>
              </View>
            </View>
            <Text style={styles.bubbleText1}>総合スコア　5UP</Text>
            <View style={styles.bubbleText23}>
              <Text style={styles.bubbleText2}>今日もスコアが伸びてる！</Text>
              <Text style={styles.bubbleText3}>けど部屋が寒くて睡眠の質が下がってるみたい</Text>
              <Text style={styles.bubbleText4}>寝るときのエアコンの温度を0.5 ℃あげてみて！</Text>
            </View>
          </View>
        </View>
        <Image source={require('../image/image_advice.png')} style={styles.characterImage} />
        <View style={styles.homeButtonShifted}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.homeButton}>
            <Text style={styles.buttonText}>ホームへ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground >
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleContainer: {
    position: 'absolute',
    top: '40%',
    width: '80%',
    alignItems: 'center',
  },
  bubble: {
    position: 'absolute',
    top: -340,
  },
  bubbleTextContainer: {
    position: 'absolute',
    top: -200,
    alignItems: 'center',
    width: 400,
  },
  bubbleArea: {
    position: 'absolute',
    alignItems: 'center',
    width: 300,
    top: 45,
  },
  bubbleText23: {
    position: 'absolute',
    alignItems: 'center',
    width: 320,
    height: 120,
    top: 265,
    backgroundColor: "#8fbc8f",
  },
  bubbleText1: {
    top: -5,
    fontSize: 30,
    fontFamily: 'RocknRollOne-Regular', // RocknRoll One フォントを適用
  },
  bubbleText2: {
    top:10,
    fontSize: 25,
    fontFamily: 'MPLUSRounded1c-Regular', // M PLUS Rounded 1c フォントを適用
  },
  bubbleText3: {
    top: 25,
    fontSize: 13.5,
    height: 100,
    left: 5,
    fontFamily: 'MPLUSRounded1c-Regular', // M PLUS Rounded 1c フォントを適用
  },
  bubbleText4: {
    top: -50,
    fontSize: 13.5,
    height: 100,
    left: 5,
    fontFamily: 'MPLUSRounded1c-Bold', // M PLUS Rounded 1c フォントを適用
  },
  meterContainer: {
    width: '80%',
    marginVertical: 5,
    alignItems: 'center',
    position: 'relative',
  },
  meterBackground: {
    width: '100%',
    height: 20,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    backgroundColor: '#76c7c0',
  },
  meterLabel: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'RocknRollOne-Regular', // RocknRoll One フォントを適用
    marginBottom: 3,
  },
  characterImage: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    width: 100,
    height: 100,
  },
  homeButtonShifted: {
    top: 260,
  },
  homeButton: {
    position: 'absolute',
    bottom: 25,
    backgroundColor: '#f0f8ff', // 添付のプログラムのボタンデザインに合わせる
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 6,
    width: '33.33%', // 横幅を広げる
  },
  buttonText: {
    color: '#212529',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});