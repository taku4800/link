import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Modal, TouchableWithoutFeedback, Animated, Easing, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg'; // 追加
import * as ImagePicker from 'expo-image-picker'; // 追加
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen'; // 追加
import { Audio } from 'expo-av'; // 追加
import { useFonts } from 'expo-font';


SplashScreen.preventAutoHideAsync(); // スプラッシュスクリーンを非表示にしない

export default function HomeScreen({ navigation, route }) {
  let [fontsLoaded] = useFonts({
    'HachiMaruPop-Regular': require('../../assets/fonts/HachiMaruPop-Regular.ttf'),
    'RocknRollOne-Regular': require('../../assets/fonts/RocknRollOne-Regular.ttf'),
    'DelaGothicOne-Regular': require('../../assets/fonts/DelaGothicOne-Regular.ttf'),
    'MPLUS2-SemiBold': require('../../assets/fonts/MPLUS2-SemiBold.ttf'),
    'KaiseiHarunoUmi-Bold': require('../../assets/fonts/KaiseiHarunoUmi-Bold.ttf'),
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [foodSelected, setFoodSelected] = useState(false);
  const [imageType, setImageType] = useState('good1'); // 'good1', 'good2', 'bad1', 'bad2'
  const [animation] = useState(new Animated.Value(0));
  const [tapAnimation] = useState(new Animated.Value(0));
  const [initialDisplay, setInitialDisplay] = useState(route.params?.fromTitle || false); // 追加
  const [fadeAnim] = useState(new Animated.Value(1)); // 追加
  const [selectedImage, setSelectedImage] = useState(null); // 追加
  const [imageFadeAnim] = useState(new Animated.Value(1)); // 追加
  const [yummyAnim] = useState(new Animated.Value(0)); // 追加
  const [sound, setSound] = useState(null); // 追加
  const [bgm, setBgm] = useState(null); // 追加
  const [soundVolume, setSoundVolume] = useState(1.0); // 追加
  const [bgmVolume, setBgmVolume] = useState(0.3); // 追加
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isSleepPressed, setIsSleepPressed] = useState(false);
  const [isExercisePressed, setIsExercisePressed] = useState(false);
  const [isFoodPressed, setIsFoodPressed] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1));

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

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // フォントが読み込まれたらスプラッシュスクリーンを非表示にする
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (initialDisplay) {
      setTimeout(() => {
        setInitialDisplay(false);
      }, 3000); // 3秒後に初期表示を終了
    }
  }, [initialDisplay]);

  useEffect(() => {
    playBgm();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [imageType]);

  useEffect(() => {
    if (initialDisplay) {
      // 吹き出しが表示されると同時に音声を再生
      if (imageType === 'good1' || imageType === 'good2') {
        playSound(require('../sound/good.mp3'));
      } else if (imageType === 'bad1' || imageType === 'bad2') {
        playSound(require('../sound/bad_B.mp3'));
      }
  
      // 3秒後に初期表示を終了
      setTimeout(() => {
        setInitialDisplay(false);
      }, 3000);
    }
  }, [initialDisplay]);

  const playSound = async (soundFile) => {
    const { sound } = await Audio.Sound.createAsync(soundFile, { volume: soundVolume }); // 音量を設定
    setSound(sound);
    await sound.playAsync();
  };

  const playBgm = async () => {
    if (bgm) {
      await bgm.unloadAsync();
    }
    const bgmFile = (imageType === 'good1' || imageType === 'good2') ? require('../sound/BGM_good.wav') : require('../sound/BGM_bad.wav');
    const { sound } = await Audio.Sound.createAsync(bgmFile, { isLooping: true, volume: bgmVolume }); // 音量を設定
    setBgm(sound);
    await sound.playAsync();
  };

  const stopBgm = async () => {
    if (bgm) {
      await bgm.stopAsync();
      await bgm.unloadAsync();
    }
  };

  const handleNavigation = async (screen) => {
    await stopBgm();
    navigation.navigate(screen);
  };

  const handleImagePress = async () => {
    await playSound(require('../sound/touch.mp3'));
    if (imageType === 'good1' || imageType === 'good2') {
      Animated.sequence([
        Animated.timing(tapAnimation, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(tapAnimation, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else if (imageType === 'bad1' || imageType === 'bad2') {
      Animated.sequence([
        Animated.timing(tapAnimation, {
          toValue: 1,
          duration: 250,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(tapAnimation, {
          toValue: -1,
          duration: 250,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(tapAnimation, {
          toValue: 0,
          duration: 250,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const pickImage = async () => {
  
    setIsOptionsOpen(false);
    // 画像ライブラリへのアクセス許可を確認
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('カメラロールへのアクセスが許可されていません。');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // 修正点
      allowsEditing: false, // 画像の切り取りや編集を無効にする
      quality: 1,
    });
  
    if (!result.canceled) {
      console.log(result.assets[0].uri); // 修正点
      setSelectedImage(result.assets[0].uri); // 追加
      setFoodSelected(true);
      // キャラクタの動きを止める
      animation.stopAnimation();
      await playSound(require('../sound/yummy.mp3'));
      // 1秒静止
      setTimeout(() => {
        // 画像を徐々に消すアニメーションを開始
        Animated.timing(imageFadeAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          setFoodSelected(false);
          setSelectedImage(null); // 画像を非表示にする
          imageFadeAnim.setValue(0); // 透過度を0に設定し続ける
          // 「yummy!」を表示
          Animated.timing(yummyAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }).start(() => {
            setTimeout(() => {
              Animated.timing(yummyAnim, {
                toValue: 0,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
              }).start(() => {
                // 元のアニメーションに戻る
                startAnimation();
              });
            }, 1000);
          });
        });
      }, 1000);
    } else {
      console.log('Image selection was canceled');
    }
    setModalVisible(false);
  };

  const startAnimation = () => {
    let animationFrameId;
    const animate = () => {
      animation.setValue(-1);
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: -1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        animationFrameId = requestAnimationFrame(animate);
      });
    };

    if (imageType === 'good1' || imageType === 'good2') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: -1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (imageType === 'bad1' || imageType === 'bad2') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    return () => cancelAnimationFrame(animationFrameId);
  };

  useEffect(() => {
    startAnimation();
  }, [imageType]);

  const imageSource = (imageType === 'good1' || imageType === 'good2') ? require('../image/image_good.png') : require('../image/image_bad.png');
  const bubbleColor = (imageType === 'good1' || imageType === 'good2') ? 'rgba(255, 182, 193, 0.8)' : 'rgba(128, 0, 128, 0.8)'; // ピンクと紫に変更し、透過させる
  const bubbleTextStyle = (imageType === 'good1' || imageType === 'good2') ? styles.bubbleTextGood : styles.bubbleTextBad;
  const scoreText = (imageType === 'good1' || imageType === 'good2') ? 'スコアアップ！\n\n' : 'スコアダウン！\n\n';
  const scoreChangeText = (imageType === 'good1' || imageType === 'good2') ? '80→90\n\n' : '90→80\n\n';
  const resultText = (imageType === 'good1' || imageType === 'good2') ? '神' : '残念';
  const animationStyle = (imageType === 'good1' || imageType === 'good2')
    ? {
      transform: [
        {
          rotate: animation.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: ['-30deg', '0deg', '30deg'],
          }),
        },
        {
          rotateY: tapAnimation.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: ['-90deg', '0deg', '90deg'],
          }),
        },
      ],
    }
    : {
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -10],
          }),
        },
        {
          rotate: tapAnimation.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: ['-15deg', '0deg', '15deg'],
          }),
        },
      ],
    };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground source={require('../image/image_g2.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {initialDisplay && (
          <View style={styles.initialDisplay}>
            <Svg height="90%" width="90%" viewBox="0 0 100 100" style={styles.bubble}>
              <Path
                d="M0 0 H 100 V 120 H 60 L 30 130 L 40 120 H 0 Z"
                fill={bubbleColor}
              />
            </Svg>
            <View style={styles.bubbleTextContainer}>
              <Text style={[styles.bubbleText, bubbleTextStyle, styles.scoreText, { fontFamily: imageType === 'good1' || imageType === 'good2' ? 'HachiMaruPop-Regular' : 'RocknRollOne-Regular' }]}>{scoreText}</Text>
              <Text style={[styles.bubbleText, bubbleTextStyle, styles.scoreChangeText, { fontFamily: imageType === 'good1' || imageType === 'good2' ? 'HachiMaruPop-Regular' : 'RocknRollOne-Regular' }]}>{scoreChangeText}</Text>
              <Text style={[styles.bubbleText, bubbleTextStyle, styles.resultText, { fontFamily: imageType === 'good1' || imageType === 'good2' ? 'HachiMaruPop-Regular' : 'RocknRollOne-Regular' }]}>{resultText}</Text>
            </View>
            <Image source={imageType === 'good1' || imageType === 'good2' ? require('../image/image_good.png') : require('../image/image_bad.png')} style={styles.characterImage} />
          </View>
        )}

        {!initialDisplay && (
          <>
            <Animated.View style={[styles.bottomRightButton, { transform: [{ scale: buttonScale }] }]}>
              <TouchableOpacity
                style={isOptionsOpen ? styles.button : styles.optionsButton}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => {playSound(require('../sound/button.mp3'));setIsOptionsOpen(!isOptionsOpen);}}
              >
                <Text style={styles.buttonText}>{isOptionsOpen ? '閉じる' : '測る'}</Text>
              </TouchableOpacity>
            </Animated.View>
            {isOptionsOpen && (
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[styles.modalButton1, isSleepPressed && styles.pressedButton]}
                  onPressIn={() => setIsSleepPressed(true)}
                  onPressOut={() => setIsSleepPressed(false)}
                  onPress={() => {playSound(require('../sound/button.mp3'));setIsOptionsOpen(false); handleNavigation('Sleep');}}
                >
                  <Text style={styles.buttonText}>寝る</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton2, isExercisePressed && styles.pressedButton]}
                  onPressIn={() => setIsExercisePressed(true)}
                  onPressOut={() => setIsExercisePressed(false)}
                  onPress={() => { playSound(require('../sound/button.mp3'));setIsOptionsOpen(false); handleNavigation('Exercise');}}
                >
                  <Text style={styles.buttonText}>走る</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton3, isFoodPressed && styles.pressedButton]}
                  onPressIn={() => setIsFoodPressed(true)}
                  onPressOut={() => setIsFoodPressed(false)}
                  onPress={pickImage}
                >
                  <Text style={styles.buttonText}>食べる</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {playSound(require('../sound/button.mp3'));setIsOptionsOpen(false)}}
                >
                  <Text style={styles.buttonText}>閉じる</Text>
                </TouchableOpacity>
              </View>
            )}

            <Animated.View style={[styles.centerBottomButton, { transform: [{ scale: buttonScale }] }]}>
              <TouchableOpacity
                style={styles.button}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => {playSound(require('../sound/button.mp3'));handleNavigation('Advice')}}
              >
                <Text style={styles.buttonText}>記録</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.bottomLeftButton, { transform: [{ scale: buttonScale }] }]}>
              <TouchableOpacity
                style={styles.button}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => {playSound(require('../sound/button.mp3'));handleNavigation('Record')}}
              >
                <Text style={styles.buttonText}>アドバイス</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableWithoutFeedback onPress={handleImagePress}>
              <Animated.Image source={imageSource} style={[styles.image, animationStyle]} />
            </TouchableWithoutFeedback>

            {selectedImage && (
              <Animated.Image source={{ uri: selectedImage }} style={[styles.selectedImage, { opacity: imageFadeAnim }]} />
            )}

            <Animated.View style={[styles.yummyTextContainer, { opacity: yummyAnim }]}>
              <Svg height="600" width="350" viewBox="0 0 100 100" style={styles.bubble2}>
                <Path
                  d="M0 0 H 100 V 80 H 60 L 50 90 L 40 80 H 0 Z"
                  fill="rgba(255, 255, 255, 0.8)"
                />
              </Svg>
              <Animated.Text style={styles.yummyText1}>
                食事スコアアップ！
              </Animated.Text>
              <Animated.Text style={styles.yummyText2}>
                時間帯ボーナス！
              </Animated.Text>
              <Animated.Text style={styles.yummyText3}>
                タンパク質ボーナス！
              </Animated.Text>
              <Animated.Text style={styles.yummyText4}>
                追加でサラダを食べると{"\n"}さらにスコアアップ！
              </Animated.Text>
            </Animated.View>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  textBubble: {
    position: 'absolute',
    top: '5%', // 必要に応じて調整
    left: '5%', // 必要に応じて調整
    right: '5%', // 必要に応じて調整
    padding: 10, // パディングを追加してテキストを囲む
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 黒色でやや透過
    borderRadius: 10, // 角を丸くする
    zIndex: 4, // テキストの後ろに配置
  },
  bubbleArrow: {
    position: 'absolute',
    bottom: -10, // 吹き出しの下に配置
    left: '50%', // 吹き出しの中央に配置
    marginLeft: -10, // 吹き出しの幅の半分を引く
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(0, 0, 0, 0.5)', // 吹き出しの背景色と同じ
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  bottomLeftButton: {
    position: 'absolute',
    bottom: 20,
    left: 0, // 左端を画面の端に
    width: '33.33%', // 横幅を広げる
  },
  button: {
    backgroundColor: '#b0c4de', // Optionsボタンの背景色
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 6,
  },
  closeButton: {
    backgroundColor: '#ccc100', // Closeボタンの背景色
  },
  buttonText: {
    color: '#212529',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80, // Closeボタンの上に表示
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#ccc100', // モーダル内のボタンの背景色
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    position: 'absolute',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 6,
    bottom: -60,
    right: 0,
    width: '33.33%', // ボタンの幅をOptionsボタンと同じに
    alignItems: 'center',
  },
  pressedButton: {
    backgroundColor: '#999999', // ボタンが押されたときの背景色
  },
  modalContent: {
    width: '100%', // モーダルの幅を調整
    alignItems: 'center',
  },
  optionsButton: {
    backgroundColor: '#b0c4de', // Optionsボタンの背景色を変更
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 6,
  },
  modalButton1: {
    backgroundColor: '#e6e6fa', // モーダル内のボタンの背景色を変更
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    position: 'absolute',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 6,
    bottom: 75,
    right: 0,
    width: '33.33%', // ボタンの幅をOptionsボタンと同じに
    alignItems: 'center',
    zIndex: 5,
  },
  modalButton2: {
    backgroundColor: '#e6e6fa', // モーダル内のボタンの背景色を変更
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    position: 'absolute',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 6,
    bottom: 30,
    right: 0,
    width: '33.33%', // ボタンの幅をOptionsボタンと同じに
    alignItems: 'center',
    zIndex: 5,
  },
  modalButton3: {
    backgroundColor: '#e6e6fa', // モーダル内のボタンの背景色を変更
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    position: 'absolute',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 6,
    bottom: -15,
    right: 0,
    width: '33.33%', // ボタンの幅をOptionsボタンと同じに
    alignItems: 'center',
    zIndex: 5,
  },
  centerBottomButton: {
    position: 'absolute',
    bottom: 20,
    left: '33.33%', // 左端を調整
    width: '33.33%', // 横幅を広げる
  },
  bottomRightButton: {
    position: 'absolute',
    bottom: 20,
    right: 0, // 右端を画面の端に
    width: '33.33%', // 横幅を広げる
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  image: {
    zIndex: 3,
    width: 100,
    height: 100,
    top: 100,
  },
  selectedImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    left: '30%', // キャラクターの左隣に配置
    bottom: '30%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  initialDisplay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    position: 'absolute',
    zIndex: 2,
    top: -50,
  },
  bubble2: {
    position: 'absolute',
    zIndex: 2,
    top: -420,
  },
  bubbleTextContainer: {
    position: 'absolute',
    zIndex: 3,
    alignItems: 'center',
    top: 60,
  },
  bubbleText: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'HachiMaruPop-Regular', // フォントを適用
  },
  bubbleTextGood: {
    color: 'green',
  },
  bubbleTextBad: {
    color: 'red',
  },
  scoreText: {
    fontSize: 40,
  },
  scoreChangeText: {
    fontSize: 30,
  },
  resultText: {
    fontSize: 100,
    height: 300,
  },
  characterImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    right: 70,
    bottom: 20,
    zIndex: 3,
  },
  hogehogeText: {
    position: 'absolute',
    zIndex: 4,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'HachiMaruPop-Regular', // フォントを適用
  },
  yummyTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  yummyText1: {
    position: 'absolute',
    top: -290,
    fontSize: 35,
    color: 'red',
    zIndex: 3,
    fontFamily: 'DelaGothicOne-Regular', // フォントを適用
  },
  yummyText2: {
    position: 'absolute',
    top: -230,
    fontSize: 30,
    color: 'red',
    zIndex: 3,
    fontFamily: 'MPLUS2-SemiBold', // フォントを適用
  },
  yummyText3: {
    position: 'absolute',
    top: -200,
    fontSize: 30,
    color: 'red',
    zIndex: 3,
    fontFamily: 'MPLUS2-SemiBold', // フォントを適用
  },
  yummyText4: {
    position: 'absolute',
    top: -120,
    fontSize: 30,
    color: 'red',
    zIndex: 3,
    height: 100,
    fontFamily: 'KaiseiHarunoUmi-Bold', // フォントを適用
  },
},
);