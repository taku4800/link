import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, Animated, Image, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Audio } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox } from 'react-native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import moment from 'moment'; // 追加

// 警告を無視する
LogBox.ignoreLogs(['Warning: Text strings must be rendered within a <Text> component']);
SplashScreen.preventAutoHideAsync();

export default function SleepScreen({ navigation }) {
  const [bgm, setBgm] = useState(null);
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepButtonText, setSleepButtonText] = useState('眠る');
  const [showBubble, setShowBubble] = useState(false);
  const [characterImage, setCharacterImage] = useState(require('../image/image_advice.png'));
  const [isScreenDark, setIsScreenDark] = useState(true);
  const [darkOpacity] = useState(new Animated.Value(1)); // 初期値を1に設定
  const [buttonScale] = useState(new Animated.Value(1)); // ボタンのアニメーション用
  const [currentTime, setCurrentTime] = useState(moment().format('HH:mm')); // 追加
  let [fontsLoaded] = useFonts({
    'MPLUSRounded1c-Regular': require('../../assets/fonts/MPLUSRounded1c-Regular.ttf'),
    'RocknRollOne-Regular': require('../../assets/fonts/RocknRollOne-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    playBgm();
    Animated.timing(darkOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsScreenDark(false)); // 0.5秒後に暗転解除
    return () => {
      if (bgm) {
        bgm.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format('HH:mm'));
    }, 1000); // 1分ごとに時刻を更新
    return () => clearInterval(timer);
  }, []);

  const playBgm = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../sound/sleep.wav'),
      { isLooping: true }
    );
    setBgm(sound);
    await sound.playAsync();
  };

  const stopBgm = async () => {
    if (bgm) {
      await bgm.stopAsync();
      await bgm.unloadAsync();
    }
  };

  const handleGoHome = async () => {
    await stopBgm();
    navigation.navigate('Home');
  };

  const handleSleep = () => {
    setIsSleeping(true);
    setSleepButtonText('起きる');
    setIsScreenDark(true);
    Animated.timing(darkOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const handleWakeUp = async () => {
    setIsSleeping(false);
    setSleepButtonText('眠る');
    setShowBubble(true);
    setCharacterImage(require('../image/image_advice.png'));
    Animated.timing(darkOpacity, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => setIsScreenDark(false)); // 起きるボタンを押した後は暗転しない
    await stopBgm();
    await playWakeBgm();
  };

  const playWakeBgm = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../sound/wake.wav'),
      { isLooping: true }
    );
    setBgm(sound);
    await sound.playAsync();
  };

  const handleScreenPress = () => {
    if (isSleeping) {
      // 1秒かけて暗転解除（画面前面に表示）
      Animated.timing(darkOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setIsScreenDark(false);
        // 2秒間暗転解除（画面背面に表示）
        setTimeout(() => {
          setIsScreenDark(true);
          // 1秒かけて暗転（画面前面に表示）
          Animated.timing(darkOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        }, 2000); // 2秒後に再び暗転
      });
    }
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const { width, height } = Dimensions.get('window');
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View style={styles.container}>
        {isScreenDark && (
          <Animated.View style={[styles.darkScreen, { opacity: darkOpacity, zIndex: isSleeping ? 10 : -1 }]} />
        )}
        <ImageBackground source={showBubble ? require('../image/image_g2.png') : require('../image/image_sleep_back.png')} style={styles.backgroundImage}>
          <View style={styles.container}>
            {showBubble && (
              <View style={styles.bubbleContainer}>
                <Svg height={height * 0.9} width={width * 0.9} viewBox="0 0 100 100" style={styles.bubble}>
                  <Path
                    d="M0 0 H 100 V 120 H 60 L 30 130 L 40 120 H 0 Z"
                    fill="rgba(255, 182, 193, 0.8)"
                  />
                </Svg>
                <View style={styles.bubbleTextContainer}>
                  <Text style={styles.bubbleText}>睡眠時間 8.5時間</Text>
                  <View style={styles.meterContainer}>
                    <Text style={styles.meterLabel}>睡眠時間 100</Text>
                    <View style={styles.meterBackground}>
                      <View style={[styles.meterFill, { width: '100%' }]} /> {/* メモリ1の値を100%に設定 */}
                    </View>
                  </View>
                  <View style={styles.meterContainer}>
                    <Text style={styles.meterLabel}>睡眠の質 80</Text>
                    <View style={styles.meterBackground}>
                      <View style={[styles.meterFill, { width: '80%' }]} /> {/* メモリ2の値を80%に設定 */}
                    </View>
                  </View>
                  <Text style={styles.bubbleScore}>睡眠スコア 90</Text>
                  <View style={styles.bubbleGoodContainer}>
                    <Text style={styles.bubbleGood}>チョー眠れてる！{"\n"}けど少し暖かくして寝たほうがいいかも</Text>
                  </View>
                </View>
              </View>
            )}
            <Image source={characterImage} style={showBubble ? styles.characterImage : styles.centerImage} />
            {!showBubble && (
              <Animated.View style={[styles.sleepButton, { transform: [{ scale: buttonScale }] }]}>
                <TouchableOpacity onPress={isSleeping ? handleWakeUp : handleSleep} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                  <Text style={styles.buttonText}>{sleepButtonText}</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
            {!isSleeping && (
              <Animated.View style={[styles.homeButton, { transform: [{ scale: buttonScale }] }, showBubble && styles.homeButtonShifted]}>
                <TouchableOpacity onPress={handleGoHome} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                  <Text style={styles.buttonText}>ホームへ</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
            {/* 追加部分 */}
            {!showBubble && (
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{currentTime}</Text>
              </View>
            )}
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
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
  centerImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 350,
    zIndex: 1,
  },
  characterImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    left: 20,
    bottom: 20,
    zIndex: 1,
  },
  sleepButton: {
    position: 'absolute',
    bottom: 85,
    backgroundColor: '#f0f8ff', // HomeScreenのAdviceボタンのデザインに合わせる
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
  homeButton: {
    position: 'absolute',
    bottom: 25,
    backgroundColor: '#f0f8ff', // HomeScreenのAdviceボタンのデザインに合わせる
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    width: '33.33%', // 横幅を広げる
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 6,
  },
  homeButtonShifted: {
    left: '230', // キャラクターの画像の左端から画面の右端までの真ん中に配置
    transform: [{ translateX: '-50%' }],
  },
  buttonText: {
    color: '#212529',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  bubbleContainer: {
    position: 'absolute',
    top: '-20%',
    alignItems: 'center',
    zIndex: 3,
  },
  bubble: {
    position: 'absolute',
    zIndex: 2,
  },
  bubbleTextContainer: {
    position: 'absolute',
    zIndex: 3,
    alignItems: 'center',
    top: 200,
  },
  bubbleText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'RocknRollOne-Regular', // RocknRoll One フォントを適用
  },
  bubbleScore: {
    color: 'black',
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'RocknRollOne-Regular', // RocknRoll One フォントを適用
  },
  bubbleGoodContainer: {
    backgroundColor: "#8fbc8f",
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 220,
    width: 300,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleGood: {
    color: 'black',
    textAlign: 'center',
    fontSize: 15,
    height: 50,
    fontFamily: 'MPLUSRounded1c-Regular', // M PLUS Rounded 1c フォントを適用
  },
  meterContainer: {
    width: '80%', // 吹き出しに対して80%の幅に固定
    marginVertical: 10,
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
  meterTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meterLabel: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'RocknRollOne-Regular', // RocknRoll One フォントを適用
  },
  darkScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 10,
  },
  timeContainer: {
    position: 'absolute',
    top: 200,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // やや透過させた白
    padding: 10,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 80,
    color: 'black',
    fontFamily: 'RocknRollOne-Regular', // RocknRoll One フォントを適用
  },
});